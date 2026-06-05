import React, { useState } from "react";

import Hero from "./Hero";
import SupportFaq from "./SupportFaq";

function SupportPage() {
  const [query, setQuery] = useState("");

  return (
    <>
      <Hero query={query} onQueryChange={setQuery} />
      <SupportFaq query={query} />
    </>
  );
}

export default SupportPage;
