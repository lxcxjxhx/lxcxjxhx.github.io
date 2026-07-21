import { Link } from "react-router-dom";
import { getActivityFeed } from "../../data/blog";
import SectionTitle from "../ui/SectionTitle";
import Badge from "../ui/Badge";
import Container from "../layout/Container";

export default function BlogSection() {
  const activityFeed = getActivityFeed();

  return (
    <section className="py-20 relative z-10 border-t border-[var(--border-subtle)]">
      <Container>
        <SectionTitle
          title="最近动态"
          subtitle="GitHub 开源活动记录与项目更新"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activityFeed.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              to={`/blog`}
              className="card-solid block p-6 no-underline group"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="purple">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--hyacinth-lavender)] transition-colors mb-3 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-3">
                {post.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{post.publishedAt}</span>
                <span>{post.readingTime} 分钟阅读</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-colors font-medium"
          >
            查看全部动态 <span>→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
