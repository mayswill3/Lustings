'use client';

export default function Footer() {
  return (
    <div className="z-[3] flex flex-col items-center justify-between mt-auto pb-[30px] md:px-0 lg:flex-row">
      <ul className="flex flex-row">
        <li className="mr-4 md:mr-[44px]">
          <a
            className="text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm"
            target="_blank"
            href="/terms"
          >
            Terms & Conditions
          </a>
        </li>
        <li className="mr-4 md:mr-[44px]">
          <a
            className="text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm"
            target="_blank"
            href="/privacy-policy"
          >
            Privacy Policy
          </a>
        </li>
        {/* <li className="mr-4 md:mr-[44px]">
          <a
            className="text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm"
            target="_blank"
            href="https://horizon-ui.notion.site/End-User-License-Agreement-8fb09441ea8c4c08b60c37996195a6d5"
          >
            License
          </a>
        </li> */}
        {/* <li>
          <a
            className="text-[10px] font-medium text-zinc-950 dark:text-zinc-400 lg:text-sm"
            target="_blank"
            href="https://horizon-ui.notion.site/Refund-Policy-1b0983287b92486cb6b18071b2343ac9"
          >
            Refund Policy
          </a>
        </li> */}
      </ul>
    </div>
  );
}
