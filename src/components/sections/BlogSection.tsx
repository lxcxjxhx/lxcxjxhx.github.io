import { Link } from "react-router-dom";
import { getBlogPosts, getBlogStats } from "../../data/blog";
import SectionTitle from "../ui/SectionTitle";
import Container from "../layout/Container";

export default function BlogSection() {
  const posts = getBlogPosts().slice(0, 3);
  const stats = getBlogStats();

  return (
    <section className="py-20 relative z-10 border-t border-[var(--border-subtle)]">
      <Container>
        <SectionTitle
          title="博客文章"
          subtitle={`来自 CSDN 的技术写作 · 累计 ${stats.totalArticles} 篇文章`}
          align="center"
        />

        <div className="space-y-4 mb-10">
          {posts.map((post) => (
            <article key={post.id} className="card-solid p-5">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline block"
              >
                <h3 className="text-base font-semibold text-[var(--text-primary)] hover:text-[var(--hyacinth-lavender)] transition-colors mb-1">
                  {post.title}
                </h3>
              </a>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
                {post.summary}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                <span>{post.publishedAt}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[var(--hyacinth-light)] hover:text-[var(--hyacinth-lavender)] transition-colors font-medium"
          >
            查看全部文章 <span>→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
