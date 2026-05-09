import { homedir } from 'node:os'
import { join } from 'node:path'

import { CLI_CONFIG_DIR_NAME, CLI_CONFIG_FILE_NAME } from './defaults'

export const getCliConfigDir = (): string => join(homedir(), CLI_CONFIG_DIR_NAME)

export const getCliConfigPath = (): string => join(getCliConfigDir(), CLI_CONFIG_FILE_NAME)
