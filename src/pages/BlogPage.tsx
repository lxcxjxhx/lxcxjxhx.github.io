import { getBlogPosts, getBlogStats } from "../data/blog";
import SectionTitle from "../components/ui/SectionTitle";
import Container from "../components/layout/Container";

export default function BlogPage() {
  const posts = getBlogPosts();
  const stats = getBlogStats();

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <Container size="md">
        <SectionTitle
          title="博客文章"
          subtitle={`CSDN 技术博客精选 · 累计 ${stats.totalArticles} 篇文章 · ${stats.columns} 个专栏`}
          align="left"
        />

        <div className="mb-8">
          <a
            href="https://security-hyacinth.blog.csdn.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="glow-btn text-sm no-underline"
          >
            访问 CSDN 主页
          </a>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="card-solid p-5 border-l-[3px] border-l-[var(--hyacinth-light)]">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline block"
              >
                <h2 className="text-lg font-semibold text-[var(--text-primary)] hover:text-[var(--hyacinth-lavender)] transition-colors mb-2">
                  {post.title}
                </h2>
              </a>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3 line-clamp-3">
                {post.summary}
              </p>
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span>{post.publishedAt}</span>
                {post.readCount > 0 && <span>阅读 {post.readCount}</span>}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
