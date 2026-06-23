// @/app/us/contact/page.jsx

import Image from 'next/image';
import './page.css';
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
                      <td className="info">
                        <span className="ViceList">
                          {vicePresidents.map((vp, idx) => (
                            <span key={idx} className="ViceItem">
                              {vp}
                              {idx < vicePresidents.length - 1 && ' / '}
                            </span>
                          ))}
                        </span>
                      </td>
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
                    href={discordInviteLink}
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
