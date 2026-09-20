"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import ResumeDownloadModal from "@/components/ResumeDownloadModal";

const RESUME_URL = "/files/Brandon-Sanders-Resume.pdf";

export default function ResumeDownloadButton() {
  const [gated, setGated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/turnstile-config")
      .then((res) => res.json())
      .then((data) => setGated(Boolean(data.siteKey)))
      .catch(() => {});
  }, []);

  function handleClick() {
    if (gated) {
      setOpen(true);
    } else {
      window.open(RESUME_URL, "_blank", "noopener");
    }
  }

  return (
    <>
      <button onClick={handleClick} className="btn-primary">
        <FontAwesomeIcon icon={faFileArrowDown} className="text-xs" /> Download Resume
      </button>
      <ResumeDownloadModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
