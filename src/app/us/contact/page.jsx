import Image from 'next/image';
import './page.css';
import JoinButton from './JoinButton.jsx';
import { DISCORD_INVITE_LINK } from '@/util/constants';
import { getBaseUrl } from '@/util/getBaseUrl';

async function fetchKvValue(key) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/kv/${encodeURIComponent(key)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return '';
    const body = await res.json().catch(() => null);
    return typeof body?.value === 'string' ? body.value : '';
  } catch (err) {
    console.error(`[contact] kv fetch failed (${key})`, err);
    return '';
  }
}

export default async function Contact() {
  const [presidentNameRaw, presidentPhone, viceNamesRaw, vicePhonesRaw] = await Promise.all([
    fetchKvValue('president-name'),
    fetchKvValue('president-phone'),
    fetchKvValue('vice-president-name'),
    fetchKvValue('vice-president-phone'),
  ]);

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
    <>
      <div className="WallLogo"></div>
      <div className="WallLogo2"></div>
      <div id="Home">
        <div id="HomeContent">
          {/* CONTACT SECTION */}
          <div className="ActivityBlock">
            <div className="SectionHeader">CONTACT:</div>
            <div className="ContactSubHeading">{thisYear} ⓒ SCSC</div>

            <div id="ContactWrapper">
              <div className="ContactDivider" />

              <div id="ContactColumnLeft">
                <table className="ContactTable">
                  <tbody>
                    <tr>
                      <td className="label">회장</td>
                      <td className="info">
                        {presidentName} {presidentPhone}
                      </td>
                    </tr>
                    <tr>
                      <td className="label">부회장</td>
                      <td className="info">{vicePresidents.join(' / ')}</td>
                    </tr>
                    <tr>
                      <td className="label">Email</td>
                      <td colSpan="2" className="info">
                        <a href="mailto:scsc.snu@gmail.com" className="ContactLink">
                          scsc.snu@gmail.com
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="label">Location</td>
                      <td colSpan="2" className="info">
                        서울대학교 학생회관 <strong>438호</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="ContactIconLink">
                  <Image
                    src="/vectors/instagram.svg"
                    alt="Instagram"
                    width={28}
                    height={28}
                    className="ico"
                  />
                  <a
                    href="https://www.instagram.com/scsc_snu/?hl=ko"
                    className="ContactLink"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @scsc_snu
                  </a>
                </div>

                <div className="ContactIconLink">
                  <Image
                    src="/vectors/github.svg"
                    alt="GitHub"
                    width={28}
                    height={28}
                    className="ico"
                  />
                  <a
                    href="https://github.com/SNU-SCSC"
                    className="ContactLink"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/SNU-SCSC
                  </a>
                </div>

                <div className="ContactIconLink">
                  <Image
                    src="/vectors/discord.svg"
                    alt="Discord"
                    width={28}
                    height={28}
                    className="ico"
                  />
                  <a
                    href={DISCORD_INVITE_LINK}
                    className="ContactLink"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discord Server
                  </a>
                </div>
              </div>

              <div id="ContactColumnRight">
                <div className="ContactLogo">SCSC.</div>
                <div className="ContactSubLogo">
                  Seoul National University
                  <br />
                  <strong>Computer Study Club</strong>
                </div>
              </div>
            </div>
          </div>

          {/* JOIN US SECTION */}

          <JoinButton />
        </div>
      </div>
    </>
  );
}
