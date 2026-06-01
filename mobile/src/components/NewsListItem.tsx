import type { NewsItem } from '@ai-rss/schema'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { getSourceLabel } from '@/constants/categoryMeta'
import { colors, spacing, typography } from '@/theme'

type NewsListItemProps = {
  item: NewsItem
  onPress?: (item: NewsItem) => void
}

export function NewsListItem({ item, onPress }: NewsListItemProps) {
  const sourceLabel = getSourceLabel(item.category, item.source)
  const tags = item.ai_tags?.slice(0, 3) ?? []

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`打开新闻：${item.title}`}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
      onPress={() => onPress?.(item)}
    >
      <View style={styles.metaRow}>
        <Text style={styles.source} numberOfLines={1}>
          {sourceLabel} · {item.published_time || item.ingest_date || '未知时间'}
        </Text>
        <Text style={styles.score}>★ {item.ai_importance}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      <Text style={styles.summary} numberOfLines={3}>
        <Text style={styles.summaryLabel}>AI摘要 </Text>
        {item.ai_summary || item.raw_content}
      </Text>

      {tags.length ? (
        <View style={styles.tags}>
          {tags.map((tag) => (
            <Text key={tag} style={styles.tag} numberOfLines={1}>
              {tag}
            </Text>
          ))}
        </View>
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.sm,
    marginBottom: spacing.md,
    marginHorizontal: spacing.pageX,
    padding: spacing.lg,
  },
  itemPressed: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.lineStrong,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  source: {
    color: colors.textSoft,
    flex: 1,
    fontSize: typography.meta.fontSize,
    fontWeight: typography.meta.fontWeight,
    lineHeight: typography.meta.lineHeight,
  },
  score: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    color: colors.accent,
    fontSize: typography.meta.fontSize,
    fontWeight: typography.meta.fontWeight,
    lineHeight: typography.meta.lineHeight,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.itemTitle.fontSize,
    fontWeight: typography.itemTitle.fontWeight,
    lineHeight: typography.itemTitle.lineHeight,
  },
  summary: {
    color: colors.textSoft,
    fontSize: typography.itemSummary.fontSize,
    lineHeight: typography.itemSummary.lineHeight,
  },
  summaryLabel: {
    color: colors.accent,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  tag: {
    backgroundColor: colors.bgSoft,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.textSoft,
    fontSize: typography.chip.fontSize,
    fontWeight: typography.chip.fontWeight,
    lineHeight: typography.chip.lineHeight,
    maxWidth: 112,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
})
