import type { NewsItem } from '@ai-rss/schema'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { fetchStaticCuratedToday } from '@/api/news'
import { AppHeader } from '@/components/AppHeader'
import { NewsListItem } from '@/components/NewsListItem'
import { colors, spacing, typography } from '@/theme'

export default function TodayScreen() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    fetchStaticCuratedToday()
      .then((payload) => {
        if (mounted) {
          setItems(payload.items)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.link}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <AppHeader
              eyebrow="Today"
              title="今日精选"
              subtitle="今日 Top 20 · 精选资讯流"
            />
            <View style={styles.statusPanel}>
              <Text style={styles.statusTitle}>数据就绪</Text>
              <Text style={styles.statusText}>
                {loading ? '正在加载精选资讯' : `已加载 ${items.length} 条精选新闻`}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => <NewsListItem item={item} />}
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>今日暂无精选</Text>
              <Text style={styles.emptyText}>稍后刷新或检查 static JSON 数据。</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  content: {
    paddingBottom: spacing.pageBottom,
  },
  statusPanel: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.lineStrong,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.lg,
    marginHorizontal: spacing.pageX,
    padding: spacing.lg,
  },
  statusTitle: {
    color: colors.accent,
    fontSize: typography.meta.fontSize,
    fontWeight: typography.meta.fontWeight,
    lineHeight: typography.meta.lineHeight,
    marginBottom: spacing.xs,
  },
  statusText: {
    color: colors.text,
    fontSize: typography.itemSummary.fontSize,
    lineHeight: typography.itemSummary.lineHeight,
  },
  empty: {
    marginHorizontal: spacing.pageX,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle.fontSize,
    fontWeight: typography.sectionTitle.fontWeight,
    lineHeight: typography.sectionTitle.lineHeight,
  },
  emptyText: {
    color: colors.textSoft,
    fontSize: typography.itemSummary.fontSize,
    lineHeight: typography.itemSummary.lineHeight,
    marginTop: spacing.xs,
  },
})
