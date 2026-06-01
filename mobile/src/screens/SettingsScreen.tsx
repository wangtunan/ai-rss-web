import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AppHeader } from '@/components/AppHeader'
import { colors, spacing, typography } from '@/theme'

const settings = [
  {
    label: '数据源',
    value: 'Static JSON',
  },
  {
    label: '本地数据',
    value: '精选与全量新闻',
  },
  {
    label: '缓存',
    value: '未启用',
  },
  {
    label: '版本',
    value: '0.1.0',
  },
]

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader
        eyebrow="Settings"
        title="设置"
        subtitle="数据源、缓存和阅读偏好。"
      />

      <View style={styles.group}>
        {settings.map((item) => (
          <View key={item.label} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  group: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: spacing.pageX,
    overflow: 'hidden',
  },
  row: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  label: {
    color: colors.textSoft,
    fontSize: typography.meta.fontSize,
    fontWeight: typography.meta.fontWeight,
    lineHeight: typography.meta.lineHeight,
  },
  value: {
    color: colors.text,
    fontSize: typography.itemTitle.fontSize,
    fontWeight: typography.itemTitle.fontWeight,
    lineHeight: typography.itemTitle.lineHeight,
  },
})
