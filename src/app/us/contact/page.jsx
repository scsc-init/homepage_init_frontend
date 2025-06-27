import Image from "next/image";
import ScrollEffectWrapper from "@/components/about/ScrollEffectWrapper";
import "./page.css";

export default function Contact() {
  const thisYear = new Date().getFullYear();

  return (
    <div id="Home">
      <div id="HomeContent">
        <ScrollEffectWrapper>
          <div id="HomeDescriptionContainer">
            <h2>Contact</h2>

            <div className="ActivityBlock">
              <h3>Contact Us</h3>
              <ul className="ContactList">
                <li>{thisYear} ⓒ SCSC</li>
                <li>
                  회장 한성재 |{" "}
                  <a href="tel:01055831811" className="ContactLink">
                    010-5583-1811
                  </a>
                </li>
                <li>
                  부회장 김지훈 |{" "}
                  <a href="tel:01082450334" className="ContactLink">
                    010-8245-0334
                  </a>
                </li>
                <li>
                  Email:{" "}
                  <a href="mailto:scsc.snu@gmail.com" className="ContactLink">
                    scsc.snu@gmail.com
                  </a>
                </li>
                <li>위치: 서울대학교 학생회관 438호</li>
                <li className="ContactIconLink">
                  <a
                    href="https://www.instagram.com/scsc_snu/?hl=ko"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ContactLink"
                  >
                    <Image
                      src="/vectors/instagram.svg"
                      alt="Instagram"
                      width={20}
                      height={20}
                    />
                    <span>@scsc_snu</span>
                  </a>
                </li>
                <li className="ContactIconLink">
                  <a
                    href="https://github.com/SNU-SCSC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ContactLink"
                  >
                    <Image
                      src="/vectors/github.svg"
                      alt="GitHub"
                      width={20}
                      height={20}
                    />
                    <span>github.com/SNU-SCSC</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="ActivityBlock">
              <h3>Join Us</h3>
              <p>
                SCSC 가입을 원하시나요? 아래 버튼을 클릭하여 신청서를
                작성해주세요.
              </p>
              <a href="/login" className="JoinButton">
                Join us!
              </a>
            </div>
          </div>
        </ScrollEffectWrapper>
      </div>
    </div>
  );
}
