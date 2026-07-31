// @/app/us/contact/page.jsx

import styles from './page.module.css';
import JoinButton from './JoinButton.jsx';
import { getKVValues } from '@/util/fetch/server-util';

export default async function Contact() {
  const kvMap = await getKVValues([
    'president-name',
    'president-phone',
    'vice-president-name',
    'vice-president-phone',
    'TEXT_DISCORD_INVITE_LINK',
  ]);

  const getValue = (key) => (kvMap[key]?.status === 'fulfilled' ? kvMap[key].value : '');

  const presidentNameRaw = getValue('president-name');
  const presidentPhone = getValue('president-phone');
  const viceNamesRaw = getValue('vice-president-name');
  const vicePhonesRaw = getValue('vice-president-phone');
  const discordInviteLink = getValue('TEXT_DISCORD_INVITE_LINK');
  const thisYear = new Date().getFullYear();
  const presidentName = presidentNameRaw || '';

  const viceNames = viceNamesRaw
    .split(';')
    .map((v) => v.trim())
    .filter(Boolean);
  const vicePhones = vicePhonesRaw
    .split(';')
    .map((v) => v.trim())
    .filter(Boolean);
  const maxVice = Math.max(viceNames.length, vicePhones.length);
  const vicePresidents = [];
  for (let i = 0; i < maxVice; i++) {
    const name = viceNames[i] || '';
    const phone = vicePhones[i] || '';
    const combined = `${name} ${phone}`.trim();
    if (combined) vicePresidents.push(combined);
  }

  return (
    <main className={styles.pageRoot}>
      <div className={styles.wallLogo}></div>
      <div className={styles.wallLogo2}></div>
      <div className={styles.home}>
        <div className={styles.homeContent}>
          {/* CONTACT SECTION */}
          <div className={styles.activityBlock}>
            <div className={styles.sectionHeader}>CONTACT:</div>
            <div className={styles.contactSubHeading}>{thisYear}년 SCSC</div>

            <div className={styles.contactWrapper}>
              <div className={styles.contactDivider} />

              <div className={styles.contactColumnLeft}>
                <table className={styles.contactTable}>
                  <tbody>
                    <tr>
                      <td className={`${styles.contactTableCell} ${styles.contactTableLabel}`}>
                        회장
                      </td>
                      <td className={`${styles.contactTableCell} ${styles.contactTableInfo}`}>
                        {presidentName} {presidentPhone}
                      </td>
                    </tr>
                    <tr>
                      <td className={`${styles.contactTableCell} ${styles.contactTableLabel}`}>
                        부회장
                      </td>
                      <td className={`${styles.contactTableCell} ${styles.contactTableInfo}`}>
                        <span className={styles.viceList}>
                          {vicePresidents.map((vp, idx) => (
                            <span key={idx} className={styles.viceItem}>
                              {vp}
                              {idx < vicePresidents.length - 1 && ' / '}
                            </span>
                          ))}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className={`${styles.contactTableCell} ${styles.contactTableLabel}`}>
                        Email
                      </td>
                      <td
                        colSpan="2"
                        className={`${styles.contactTableCell} ${styles.contactTableInfo}`}
                      >
                        <a href="mailto:scsc.snu@gmail.com" className={styles.contactLink}>
                          scsc.snu@gmail.com
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className={`${styles.contactTableCell} ${styles.contactTableLabel}`}>
                        Location
                      </td>
                      <td
                        colSpan="2"
                        className={`${styles.contactTableCell} ${styles.contactTableInfo}`}
                      >
                        서울대학교 학생회관 <strong>438호</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className={styles.contactIconLink}>
                  <span
                    className={`${styles.socialIcon} ${styles.instagramIcon}`}
                    aria-hidden="true"
                  />
                  <a
                    href="https://www.instagram.com/scsc_snu/?hl=ko"
                    className={styles.contactLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @scsc_snu
                  </a>
                </div>

                <div className={styles.contactIconLink}>
                  <span
                    className={`${styles.socialIcon} ${styles.githubIcon}`}
                    aria-hidden="true"
                  />
                  <a
                    href="https://github.com/SNU-SCSC"
                    className={styles.contactLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/SNU-SCSC
                  </a>
                </div>

                <div className={styles.contactIconLink}>
                  <span
                    className={`${styles.socialIcon} ${styles.discordIcon}`}
                    aria-hidden="true"
                  />
                  <a
                    href={discordInviteLink}
                    className={styles.contactLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discord Server
                  </a>
                </div>
              </div>

              <div className={styles.contactColumnRight}>
                <div className={styles.contactLogo}>SCSC.</div>
                <div className={styles.contactSubLogo}>
                  Seoul National University
                  <br />
                  <strong className={styles.contactSubLogoStrong}>Computer Study Club</strong>
                </div>
              </div>
            </div>
          </div>

          {/* JOIN US SECTION */}

          <JoinButton />
        </div>
      </div>
    </main>
  );
}
