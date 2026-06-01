import { StyleSheet, Text, View } from 'react-native'

import { colors, spacing, typography } from '@/theme'

type AppHeaderProps = {
  eyebrow: string
  title: string
  subtitle?: string
}

export function AppHeader({ eyebrow, title, subtitle }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.pageX,
    paddingTop: spacing.pageTop,
    paddingBottom: spacing.lg,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: typography.meta.fontSize,
    fontWeight: typography.meta.fontWeight,
    lineHeight: typography.meta.lineHeight,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: typography.screenTitle.fontSize,
    fontWeight: typography.screenTitle.fontWeight,
    lineHeight: typography.screenTitle.lineHeight,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: typography.itemSummary.fontSize,
    lineHeight: typography.itemSummary.lineHeight,
    marginTop: spacing.xs,
  },
})
