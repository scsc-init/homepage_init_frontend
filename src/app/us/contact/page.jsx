import Image from "next/image";
import "./page.css";
import JoinButton from "./JoinButton.jsx";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";

async function fetchDiscordInviteLink() {
  const res = await fetch(`${getBaseUrl()}/api/bot/discord/general/get_invite`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (res.ok) {
    const resData = await res.json();
    return resData.result.invite_url;
  }
}

export default async function Contact() {
  const thisYear = new Date().getFullYear();

  const discordInviteLink = await fetchDiscordInviteLink();

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
                      <td className="info">한성재 010-5583-1811</td>
                    </tr>
                    <tr>
                      <td className="label">부회장</td>
                      <td className="info">김지훈 010-8245-0334</td>
                    </tr>
                    <tr>
                      <td className="label">Email</td>
                      <td colSpan="2" className="info">
                        <a
                          href="mailto:scsc.snu@gmail.com"
                          className="ContactLink"
                        >
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
