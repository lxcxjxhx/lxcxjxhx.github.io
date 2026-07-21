import { getActivityFeed } from "../data/blog";
import SectionTitle from "../components/ui/SectionTitle";
import Badge from "../components/ui/Badge";
import Container from "../components/layout/Container";

export default function BlogPage() {
  const activityFeed = getActivityFeed();

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <Container size="md">
        <SectionTitle
          title="最近动态"
          subtitle="GitHub 开源活动记录与项目更新"
          align="left"
        />

        <div className="space-y-6">
          {activityFeed.map((post) => (
            <article key={post.id} className="card-solid p-6 group cursor-pointer">
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="purple">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--hyacinth-lavender)] transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                {post.summary}
              </p>
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span>{post.publishedAt}</span>
                <span>·</span>
                <span>{post.readingTime} 分钟阅读</span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
