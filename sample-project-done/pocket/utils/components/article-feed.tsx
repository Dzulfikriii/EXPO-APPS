import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from "../Colors";



interface ArticlesFeedProps {
  maxItems?: number;
  feedSource?: 'expo' | 'react-native';
  title?: string;
}

interface RSSArticle {
    id: number;
    title: string;
    url: string;
    description: string;
    publisedDate: string;
    category: string;
    image: string;
    source: string;
    estimatedReadTime: number;
}

interface ArticleCardProps {
    article: RSSArticle;
    onSave: (article: RSSArticle) => void;
    variant?: 'featured' | 'compact';
}

const ArticleCard = ({article, onSave, variant = 'compact'} : ArticleCardProps) => {

    const hasImage = article.image && article.image.length > 0;

    const handlePress = () => {
        if (article.url) {
            Linking.openURL(article.url);
        }
    }

    if(variant === 'featured') {
        return (
            <TouchableOpacity onPress={handlePress} style={styles.featureCard}>
                {hasImage && (
                    <Image source={{uri: article.image}} style={styles.featureImage} />
                )}
                <View style={styles.featureContent}>
                    <Text numberOfLines={2} style={styles.featureTitle}>{article.title}</Text>
                     <View style={styles.cardActions}>
                    <View style={styles.featuredMeta}>
                        <Text style={styles.metaText}>{article.source}</Text>
                        <Text style={styles.metaText}>{article.estimatedReadTime}</Text>
                        <Text>{article.estimatedReadTime}</Text>
                    </View>
                    <TouchableOpacity style={styles.saveButton} onPress={(e) => {
                        e.stopPropagation();
                        onSave(article);
                    }}>
                        <Image source={require('@/assets/images/icon.png')} style={{ width: 24, height: 24 }} />
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>
                </View>

            </TouchableOpacity>
        );
    }

    return (
            <TouchableOpacity onPress={handlePress} style={styles.compactCard}>

                <View style={styles.compactCardContent}>
                    <View style={styles.compactTopRow}>
                        <View style={styles.compactTitleContainer}>
                            <Text numberOfLines={2} style={styles.compactTitle}>{article.title}</Text>
                        </View>
                        {hasImage && (
                            <Image source={{uri: article.image}} style={styles.compactImage} />
                        )}
                    </View>
                    <View style={styles.cardActions}>
                    <View style={styles.featuredMeta}>
                        <Text style={styles.metaText}>{article.source}</Text>
                        <Text style={styles.metaText}>{article.estimatedReadTime}</Text>
                        <Text>{article.estimatedReadTime}</Text>
                    </View>
                    <TouchableOpacity style={styles.saveButton} onPress={(e) => {
                        e.stopPropagation();
                        onSave(article);
                    }}>
                        <Image source={require('@/assets/images/icon.png')} style={{ width: 20, height: 20 }} />
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>
                </View>

                
                     

            </TouchableOpacity>
        );
}

const ArticleFeed = ({ 
    maxItems = 10,
    feedSource = 'react-native',
    title = 'Article Feed' 
}: ArticlesFeedProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [articles, setArticles] = useState<RSSArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFreshArticles();
  }, []);

  const fetchFreshArticles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/rss-feed?url=${feedSource}`);
      const result = await response.json();
      console.log(result);
      if (result.success) {
        setArticles(result.data.items);
      }
    } catch (error) {
      setIsRefreshing(false);
      console.error(error);
    }
    finally {
        setIsLoading(false);
    }
  }

  const handleSaveArticle = async () => {

  }

  const handleRefresh = async () => {

  }

  if (isLoading || articles.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading article...</Text>
        </View>
      </View>
    );
  }

  const renderHeader = () => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    );
  }

  const renderItem = ({ item, index } : { item : RSSArticle, index : number }) => {
    if (index === 0) {
      return (
        <>
        {renderHeader()}
        <ArticleCard article={item} onSave={handleSaveArticle} variant="featured" />
        <View style={styles.separator}/>
        {articles.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 24 }} contentContainerStyle={{ paddingRight: 24 }}>
                {articles.slice(1).map((article, index) => (
                    <View key={index} style={styles.compactCardWrapper}>
                    <ArticleCard key={article.id} article={article} onSave={handleSaveArticle} />
                    </View>
                ))}
            </ScrollView>
        )}
        </>
      );
    }
    return null;
  }

  return (
    <FlatList
        data={articles}
        style={styles.container}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)} 
        contentContainerStyle={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    marginTop: 160,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textGray,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  separator: {
    height: 1,
    // backgroundColor: COLORS.border,
  },
  compactCardWrapper: {
    width: 280,
    marginRight: 16,
    marginVertical: 4,
  },
  featureCard: {
    backgroundColor: COLORS.white,
    elevation: 4,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featureImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  featureContent: {
    padding: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    lineHeight: 26,
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.itemBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  saveText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.textGray,
    fontWeight: 500,
  },
  compactCard: {
    backgroundColor: COLORS.white,
    elevation: 2,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  compactCardContent: {
    padding: 12,
  },
  compactTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  compactTitleContainer: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    lineHeight: 20,
  },
  compactImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f5f5f5',
  },
});

export default ArticleFeed;
