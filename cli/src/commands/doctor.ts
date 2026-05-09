import type { Command } from 'commander'

import { getCliConfigPath, loadCliConfig } from '../config'
import type { CliConfig } from '../config'
import { printJson } from '../output/json'
import { resolveJsonOption } from './options'
import type { JsonOption } from './options'

type DoctorStatus = 'pass' | 'warn' | 'fail'

interface DoctorCheck {
  name: string
  status: DoctorStatus
  message: string
}

interface DoctorReport {
  mode: CliConfig['mode']
  configPath: string
  checks: DoctorCheck[]
}

const STATIC_REQUIRED_FILES = ['all.json', 'curated-today.json', 'sources.json'] as const

const joinUrl = (baseUrl: string, fileName: string): string => {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedFile = fileName.replace(/^\/+/, '')
  return `${normalizedBase}/${normalizedFile}`
}

const createCheck = (name: string, status: DoctorStatus, message: string): DoctorCheck => ({
  name,
  status,
  message,
})

const checkStaticJsonFile = async (baseUrl: string, fileName: string): Promise<DoctorCheck> => {
  const url = joinUrl(baseUrl, fileName)

  try {
    const response = await fetch(url)
    if (!response.ok) {
      return createCheck(fileName, 'fail', `${url} returned HTTP ${response.status}`)
    }

    await response.json()
    return createCheck(fileName, 'pass', `${url} is reachable and returns JSON`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createCheck(fileName, 'fail', `${url} is not readable: ${message}`)
  }
}

const createStaticReport = async (config: CliConfig): Promise<DoctorReport> => {
  const checks: DoctorCheck[] = [
    createCheck('mode', 'pass', 'static mode is configured'),
  ]

  if (!config.staticBaseUrl) {
    checks.push(createCheck('staticBaseUrl', 'fail', 'staticBaseUrl is missing. Run: ai-rss config set static-base-url <url>'))
    return {
      mode: config.mode,
      configPath: getCliConfigPath(),
      checks,
    }
  }

  checks.push(createCheck('staticBaseUrl', 'pass', config.staticBaseUrl))

  if (typeof fetch !== 'function') {
    checks.push(createCheck('fetch', 'fail', 'global fetch is not available in this Node.js runtime'))
    return {
      mode: config.mode,
      configPath: getCliConfigPath(),
      checks,
    }
  }

  const fileChecks = await Promise.all(STATIC_REQUIRED_FILES.map((fileName) => checkStaticJsonFile(config.staticBaseUrl, fileName)))
  checks.push(...fileChecks)

  return {
    mode: config.mode,
    configPath: getCliConfigPath(),
    checks,
  }
}

const createSupabaseReport = (config: CliConfig): DoctorReport => {
  const checks: DoctorCheck[] = [
    createCheck('mode', 'warn', 'supabase mode is configured, but the read client is not implemented yet'),
  ]

  checks.push(
    config.supabaseUrl
      ? createCheck('supabaseUrl', 'pass', config.supabaseUrl)
      : createCheck('supabaseUrl', 'fail', 'supabaseUrl is missing'),
  )
  checks.push(
    config.supabaseKey
      ? createCheck('supabaseKey', 'pass', 'configured')
      : createCheck('supabaseKey', 'fail', 'supabaseKey is missing'),
  )

  return {
    mode: config.mode,
    configPath: getCliConfigPath(),
    checks,
  }
}

const createDoctorReport = async (): Promise<DoctorReport> => {
  const config = await loadCliConfig()
  if (config.mode === 'static') return createStaticReport(config)
  return createSupabaseReport(config)
}

const getExitCode = (report: DoctorReport): number => {
  return report.checks.some((check) => check.status === 'fail') ? 1 : 0
}

const printDoctorReport = (report: DoctorReport): void => {
  console.log('AI RSS CLI doctor')
  console.log('')
  console.log(`Config: ${report.configPath}`)
  console.log(`Mode: ${report.mode}`)
  console.log('')

  report.checks.forEach((check) => {
    console.log(`[${check.status}] ${check.name}: ${check.message}`)
  })
}

export const registerDoctorCommand = (program: Command): void => {
  program
    .command('doctor')
    .description('check read-only CLI data source configuration')
    .option('--json', 'output raw JSON')
    .action(async (options: JsonOption) => {
      const report = await createDoctorReport()

      if (resolveJsonOption(program, options)) {
        printJson(report)
      } else {
        printDoctorReport(report)
      }

      if (getExitCode(report) !== 0) process.exitCode = 1
    })
}
