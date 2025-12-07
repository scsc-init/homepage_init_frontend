import ReactMarkdown from 'react-markdown';
import styles from '../about.module.css';
import './page.css';

export const dynamic = 'force-dynamic';

async function fetchMarkdown() {
  const url =
    'https://raw.githubusercontent.com/scsc-init/homepage_init/master/%ED%9A%8C%EC%B9%99.md';
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch regulation markdown.');
  }
  return res.text();
}

export default async function RegulationPage() {
  const markdow = await fetchMarkdown();
  const markdown = markdow.replace('<!-- SCSC 회칙 -->', '');

  return (
    <>
      <div className={styles.wallLogo}></div>
      <div className={styles.wallLogo2}></div>
      <main className="AboutMain">
        <section id="rules" className="AboutSection AnchorOffset">
          <div className="AboutInner">
            <h1 className="AboutTitle">회칙</h1>
            <div className="RegulationItem">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
