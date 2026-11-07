import { FormEvent, useEffect, useState } from "react";

type Experience = {
  id: number;
  name: string;
  price: string;
  numericPrice: number;
  duration: string;
  type: string;
  description: string;
  image: string;
  code: string;
  featured?: boolean;
};

const experiences: Experience[] = [
  {
    id: 1,
    name: "Old Town Heritage Tour",
    price: "KES 1,500",
    numericPrice: 1500,
    duration: "2–3 hours",
    type: "Walking trail",
    description:
      "Walk through the historic streets of Old Town, discover Swahili architecture and uncover the stories that make this coastal city unique.",
    image: "/images/old-town-street.jpg",
    code: "*384*1#",
    featured: true,
  },
  {
    id: 2,
    name: "Tudor Creek Dhow Ride",
    price: "KES 2,500",
    numericPrice: 2500,
    duration: "1–2 hours",
    type: "Maritime sunset sail",
    description:
      "Step aboard a traditional wooden dhow and experience the peaceful beauty of Tudor Creek.",
    image: "/images/dhow-sail.jpg",
    code: "*384*2#",
  },
  {
    id: 3,
    name: "Fort Jesus Experience",
    price: "KES 1,200",
    numericPrice: 1200,
    duration: "1–2 hours",
    type: "Unesco coastal landmark",
    description:
      "Explore the architecture, history and stories of one of Kenya's most remarkable coastal landmarks.",
    image: "/images/fort-jesus.jpg",
    code: "*384*3#",
  },
];

const values = [
  {
    number: "01 / ROOTS",
    title: "Locally Guided",
    copy: "Led by people whose families have navigated Old Town’s coral alleys and Tudor Creek’s tides for generations.",
  },
  {
    number: "02 / FAIRNESS",
    title: "Transparent Pricing",
    copy: "Honest, all-inclusive coastal rates in Kenyan Shillings. No tourist markups, no hidden wharf fees.",
  },
  {
    number: "03 / INCLUSION",
    title: "Accessible Booking",
    copy: "Book instantly online or dial offline via USSD (*384*123#). Zero data or smartphone required.",
  },
];

const ussdScreens = [
  {
    label: "Menu",
    title: "Mombasa Tour Direct",
    lines: ["1. Old Town Heritage (1.5k)", "2. Tudor Creek Dhow (2.5k)", "3. Fort Jesus (1.2k)"],
    prompt: "Select option (1–3):",
  },
  {
    label: "Tour",
    title: "Old Town Heritage",
    lines: ["Guided walking trail", "Duration: 2–3 hours", "Price: KES 1,500"],
    prompt: "1. Continue   0. Back",
  },
  {
    label: "Time",
    title: "Choose a date",
    lines: ["1. Tomorrow, 09:00", "2. Friday, 14:00", "3. Saturday, 10:00"],
    prompt: "Select option (1–3):",
  },
  {
    label: "Guests",
    title: "Number of visitors",
    lines: ["Maximum group size: 8", "Enter visitors from 1–8"],
    prompt: "Number of guests:",
  },
  {
    label: "Pay",
    title: "Confirm booking",
    lines: ["Old Town Heritage", "Tomorrow, 09:00 · 1 guest", "Total: KES 1,500"],
    prompt: "1. Pay with M-Pesa   0. Cancel",
  },
  {
    label: "SMS",
    title: "Booking confirmed",
    lines: ["Ref: MTD-25041", "Meet at Old Port gate", "Confirmation sent by SMS."],
    prompt: "Thank you. Karibu Mombasa.",
  },
];

const Arrow = ({ light = false, compact = false }: { light?: boolean; compact?: boolean }) => (
  <img
    aria-hidden="true"
    className={compact ? "arrow-icon compact" : "arrow-icon"}
    src={light ? "/assets/82091.svg" : compact ? "/assets/7edb0.svg" : "/assets/f3820.svg"}
  />
);

function Header({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" onClick={close} aria-label="Mombasa Tour Direct home">
          <span className="brand-mark">
            <img src="/assets/ea4a6.svg" alt="" />
          </span>
          <span>
            <strong>Mombasa Tour Direct</strong>
            <small>Old Town & Tudor Creek</small>
          </span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
          <b>{open ? "Close" : "Menu"}</b>
        </button>
        <nav id="main-nav" className={open ? "main-nav is-open" : "main-nav"}>
          <a href="#experiences" onClick={close}>
            Explore tours
          </a>
          <a href="#story" onClick={close}>
            The story
          </a>
          <a href="#offline" onClick={close}>
            Offline access
          </a>
          <a href="#about" onClick={close}>
            About
          </a>
          <a href="#inquiries" onClick={close}>
            Inquiries
          </a>
        </nav>
        <button className="button button-primary header-cta" onClick={onBook}>
          Book an experience
        </button>
      </div>
    </header>
  );
}

function ExperienceCard({
  experience,
  onSelect,
}: {
  experience: Experience;
  onSelect: (experience: Experience) => void;
}) {
  return (
    <article className={experience.featured ? "experience featured" : "experience"}>
      <div className="experience-image">
        <img src={experience.image} alt="" />
        {experience.featured && <span className="image-label">Featured heritage trail</span>}
        <span className="ussd-tag">USSD: {experience.code}</span>
      </div>
      <div className="experience-title-row">
        <h3>{experience.name}</h3>
        <p className="price">
          {experience.price}
          {experience.featured && <small> / guest</small>}
        </p>
      </div>
      <p className="meta">
        {experience.duration} <i>•</i> {experience.type}
      </p>
      <p className="experience-copy">{experience.description}</p>
      <button className="text-link" onClick={() => onSelect(experience)}>
        {experience.featured ? "View experience & book" : "View experience"}{" "}
        <Arrow compact={!experience.featured} />
      </button>
    </article>
  );
}

function FeaturePhone() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const screen = ussdScreens[step];
  const keyLetters: Record<string, string> = {
    "1": "_",
    "2": "ABC",
    "3": "DEF",
    "4": "GHI",
    "5": "JKL",
    "6": "MNO",
    "7": "PQRS",
    "8": "TUV",
    "9": "WXYZ",
    "*": "+",
    "0": "space",
    "#": "shift",
  };

  const press = (key: string) => {
    setError("");
    if (/[0-9]/.test(key)) setInput(key);
  };
  const send = () => {
    if (step === ussdScreens.length - 1) {
      setStep(0);
      setInput("");
      return;
    }
    const max = step === 3 ? 8 : step === 4 ? 1 : 3;
    const value = Number(input);
    if (!input || value < 1 || value > max) {
      setError(`Invalid entry. Choose 1–${max}.`);
      return;
    }
    setStep((current) => current + 1);
    setInput("");
  };
  const back = () => {
    setError("");
    setInput("");
    setStep((current) => Math.max(0, current - 1));
  };
  const reset = () => {
    setStep(0);
    setInput("");
    setError("");
  };

  return (
    <div className="simulator">
      <div className="flow-indicators" aria-label={`USSD step ${step + 1} of 6`}>
        {ussdScreens.map((item, index) => (
          <span
            className={index === step ? "active" : index < step ? "complete" : ""}
            key={item.label}
          >
            {index + 1}. {item.label}
          </span>
        ))}
      </div>
      <div className="phone">
        <div className="speaker" />
        <div className="screen-bezel">
          <div className="lcd">
            <div className="lcd-status">
              <span>*384*123# · SAFARICOM</span>
              <span>100%</span>
            </div>
            <div className="lcd-body" aria-live="polite">
              <strong>{screen.title}</strong>
              {screen.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <small>{error || screen.prompt}</small>
            </div>
            <div className="lcd-input">
              <b>KEY:</b>
              <span>{input || "—"}</span>
            </div>
          </div>
        </div>
        <div className="soft-keys">
          <button onClick={send}>{step === 5 ? "Restart" : "Send"}</button>
          <button onClick={back} aria-label="Go back" className="phone-back">
            <img src="/assets/16aaf.svg" alt="" />
          </button>
          <button onClick={reset}>Cancel</button>
        </div>
        <div className="keypad">
          {Object.entries(keyLetters).map(([key, letters]) => (
            <button key={key} onClick={() => press(key)}>
              <b>{key}</b>
              <small>{letters}</small>
            </button>
          ))}
        </div>
        <div className="mic" />
      </div>
      <p className="simulator-help">
        Press a digit, then <b>SEND</b> <i>•</i> <button onClick={reset}>Reset</button>
      </p>
    </div>
  );
}

function BookingModal({ selected, onClose }: { selected: Experience | null; onClose: () => void }) {
  const [stage, setStage] = useState<"details" | "form" | "success">("details");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    if (selected) {
      setStage("details");
      setGuests(1);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  if (!selected) return null;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setStage("success");
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close booking">
          ×
        </button>
        {stage === "details" && (
          <>
            <div className="modal-image">
              <img src={selected.image} alt="" />
            </div>
            <p className="eyebrow">Curated experience · {selected.code}</p>
            <h2 id="booking-title">{selected.name}</h2>
            <p>{selected.description}</p>
            <div className="modal-facts">
              <span>
                <small>Duration</small>
                {selected.duration}
              </span>
              <span>
                <small>From</small>
                {selected.price} / guest
              </span>
            </div>
            <button className="button button-primary" onClick={() => setStage("form")}>
              Continue to booking
            </button>
          </>
        )}
        {stage === "form" && (
          <form className="booking-form" onSubmit={submit}>
            <p className="eyebrow">Book direct</p>
            <h2 id="booking-title">Reserve your place.</h2>
            <label>
              Full name
              <input name="name" autoComplete="name" required placeholder="Your full name" />
            </label>
            <label>
              Mobile number
              <input
                name="phone"
                autoComplete="tel"
                type="tel"
                required
                placeholder="+254 700 000 000"
              />
            </label>
            <div className="form-row">
              <label>
                Preferred date
                <input name="date" type="date" required />
              </label>
              <label>
                Visitors
                <select value={guests} onChange={(event) => setGuests(Number(event.target.value))}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                    <option key={number}>{number}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="booking-total">
              <span>Total</span>
              <strong>KES {(selected.numericPrice * guests).toLocaleString()}</strong>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setStage("details")}
              >
                Back
              </button>
              <button className="button button-primary">Confirm booking</button>
            </div>
          </form>
        )}
        {stage === "success" && (
          <div className="confirmation">
            <span className="confirmation-mark">
              <img src="/assets/8a3db.svg" alt="" />
            </span>
            <p className="eyebrow">Booking confirmed</p>
            <h2 id="booking-title">Your Mombasa story starts here.</h2>
            <p>
              Thank you. Your place on the {selected.name} is reserved. A confirmation has been sent
              to your mobile.
            </p>
            <div className="reference">
              <small>Booking reference</small>
              <strong>MTD-25041</strong>
            </div>
            <button className="button button-primary" onClick={onClose}>
              Return to experiences
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function App() {
  const [booking, setBooking] = useState<Experience | null>(null);
  const startBooking = () => setBooking(experiences[0]);
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText("*384*123#");
    } catch {
      // The code remains visible for manual copying when clipboard access is unavailable.
    }
  };

  return (
    <div id="top">
      <Header onBook={startBooking} />
      <main>
        <section className="hero section-shell">
          <div className="hero-copy">
            <p className="eyebrow">Coastal Swahili journeys · Volume I</p>
            <h1>
              Experience Mombasa <em>Like a Local.</em>
            </h1>
            <p className="lead">
              Discover the stories, culture and hidden gems of Mombasa through authentic experiences
              led by local guides.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#experiences">
                Explore experiences <Arrow light />
              </a>
              <a className="button button-secondary" href="#offline">
                Book without internet <code>*384*123#</code>
              </a>
            </div>
            <div className="hero-meta">
              <span>Curated generational guides</span>
              <i>•</i>
              <span>Transparent coastal rates</span>
              <i>•</i>
              <span>Zero data required</span>
            </div>
          </div>
          <figure className="hero-image">
            <img
              src="/images/tudor-creek-dhow.jpg"
              alt="A traditional dhow sailing on the Kenyan coast"
            />
            <figcaption>
              <span>
                <em>Tudor Creek, Mombasa · Lat 4.0435° S</em>
                <small>Captain Ali · Sunset dhow crossing</small>
              </span>
              <small>Maritime folio 01</small>
            </figcaption>
          </figure>
        </section>

        <section className="values">
          <div className="section-shell value-grid">
            {values.map((value) => (
              <article key={value.number}>
                <p className="kicker">{value.number}</p>
                <h3>{value.title}</h3>
                <p>{value.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="experiences section-shell" id="experiences">
          <header className="section-heading">
            <div>
              <p className="eyebrow">Curated journeys</p>
              <h2>Discover the Coast, Your Way.</h2>
              <p>
                Explore the history, culture and coastline of Mombasa through unhurried
                community-led encounters.
              </p>
            </div>
            <small>Illustrative demo rates · 2025 Series</small>
          </header>
          <div className="experience-grid">
            <ExperienceCard experience={experiences[0]} onSelect={setBooking} />
            <div className="companion-stack">
              <ExperienceCard experience={experiences[1]} onSelect={setBooking} />
              <ExperienceCard experience={experiences[2]} onSelect={setBooking} />
            </div>
          </div>
        </section>

        <section className="offline" id="offline">
          <div className="section-shell offline-grid">
            <div className="offline-copy">
              <p className="eyebrow">Inclusive infrastructure · Africa’s Talking API</p>
              <h2>
                No Smartphone? <em>No Problem.</em>
              </h2>
              <p className="lead">
                Some of the best experiences should never depend on having the latest phone. Book
                your Mombasa adventure using a simple mobile menu, wherever you are.
              </p>
              <div className="dial-card">
                <div>
                  <span>Universal dial code</span>
                  <small>Safaricom & Airtel East Africa</small>
                </div>
                <div>
                  <code>*384*123#</code>
                  <button onClick={copyCode}>
                    <img src="/assets/e557d.svg" alt="" />
                    Copy code
                  </button>
                </div>
                <p>
                  Available 24/7 on basic handsets. Free dial session; standard M-Pesa payment
                  authorization upon confirmation.
                </p>
              </div>
              <div className="offline-specs">
                <span>
                  <b>Offline Native</b>
                  <small>Operates at zero data balance.</small>
                </span>
                <span>
                  <b>Direct Booking</b>
                  <small>Connects directly to your guide.</small>
                </span>
                <span>
                  <b>Instant Ticket</b>
                  <small>Confirmation via GSM SMS.</small>
                </span>
              </div>
            </div>
            <FeaturePhone />
          </div>
        </section>

        <section className="process section-shell" id="story">
          <div className="narrow-heading">
            <p className="eyebrow">The process</p>
            <h2>Your Next Experience in Three Simple Steps.</h2>
          </div>
          <div className="steps">
            <article>
              <em>01</em>
              <h3>Discover</h3>
              <p>
                Find an experience that interests you, curated with licensed local elders and
                captains.
              </p>
              <small>Curated Swahili trails</small>
            </article>
            <article>
              <em>02</em>
              <h3>Book</h3>
              <p>
                Reserve online or dial <code>*384*123#</code> on any mobile phone. Pay seamlessly
                via M-Pesa.
              </p>
              <small>Online & USSD checkout</small>
            </article>
            <article>
              <em>03</em>
              <h3>Explore</h3>
              <p>
                Receive confirmation via instant SMS and meet your guide at the Old Port or Fort
                Jesus gate.
              </p>
              <small>SMS ticket · Direct meeting</small>
            </article>
          </div>
        </section>

        <section className="about" id="about">
          <div className="section-shell">
            <div className="about-copy">
              <p className="eyebrow">The mission</p>
              <h2>Fair Direct Coastal Tourism</h2>
              <p>
                Born out of the Innovate Mombasa Hackathon, our mission is to empower generational
                local captains, heritage guides, and storytellers by removing extractive
                middle-layers. Whether browsing on 5G or dialing from a basic feature phone in
                Likoni, authentic coastal culture belongs to everyone.
              </p>
              <small>Coast Kenya · Open heritage initiative</small>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <span className="cta-mark">
            <img src="/assets/8a3db.svg" alt="" />
          </span>
          <h2>
            Your Mombasa Story <em>Starts Here.</em>
          </h2>
          <p>
            From historic streets to beautiful coastal waters, discover Mombasa through the people
            who know it best.
          </p>
          <div>
            <a className="button button-primary" href="#experiences">
              Explore experiences
            </a>
            <a className="button button-secondary" href="#offline">
              Dial *384*123# (offline)
            </a>
          </div>
        </section>
      </main>

      <footer id="inquiries">
        <div className="section-shell">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>Mombasa Tour Direct</h3>
              <p>
                Curated Swahili maritime journeys, dhow excursions, and historical Old Town trails
                connecting travellers directly with licensed local elders and captains.
              </p>
              <small>Location: Old Town & Tudor Creek, Mombasa, Kenya</small>
            </div>
            <div>
              <h4>Navigation</h4>
              <a href="#top">Home</a>
              <a href="#experiences">Explore Tours</a>
              <a href="#story">The Story</a>
              <a href="#about">About</a>
            </div>
            <div>
              <h4>Inquiries</h4>
              <a href="mailto:tours@mombasadirect.ke">tours@mombasadirect.ke</a>
              <a href="tel:+254700123456">+254 700 123 456</a>
              <small>Support hours: 07:00 – 19:00 EAT</small>
            </div>
            <div>
              <h4>Offline access</h4>
              <div className="footer-code">
                <code>*384*123#</code>
                <small>Safaricom & Airtel East Africa</small>
              </div>
            </div>
          </div>
          <div className="colophon">
            <span>
              Built for Innovate Mombasa Hackathon. USSD concept powered by Africa’s Talking API.
            </span>
            <span>© 2025 Mombasa Tour Direct.</span>
          </div>
        </div>
      </footer>
      <BookingModal selected={booking} onClose={() => setBooking(null)} />
    </div>
  );
}
