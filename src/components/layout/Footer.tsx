import Container from "./Container";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-subtle)] py-8 mt-20">
      <Container className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-gradient-to-br from-[var(--hyacinth-crimson)] to-[var(--hyacinth-green)] flex items-center justify-center text-white font-bold text-xs">
            H
          </span>
          <span className="text-sm text-[var(--text-muted)]">
            © {currentYear} HOS. 以代码理解世界。
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/lxcxjxhx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--hyacinth-lavender)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://security-hyacinth.blog.csdn.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--hyacinth-lavender)] transition-colors"
          >
            CSDN
          </a>
          <a
            href="https://pypi.org/user/lxcxjxhx/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--hyacinth-lavender)] transition-colors"
          >
            PyPI
          </a>
          <a
            href="mailto:aqfxz_zh@qq.com"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--hyacinth-lavender)] transition-colors"
          >
            邮件
          </a>
        </div>
      </Container>
    </footer>
  );
}
