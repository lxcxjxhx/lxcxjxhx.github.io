import { blogPosts } from "../data/blog";
import SectionTitle from "../components/ui/SectionTitle";
import Badge from "../components/ui/Badge";

export default function BlogPage() {
  return (
    <div className="pt-24 pb-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <SectionTitle
          title="技术博客"
          subtitle="工程实践、安全研究与系统设计的思考记录"
          align="left"
        />

        <div className="space-y-6">
          {blogPosts.map((post) => (
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
      </div>
    </div>
  );
}
