import { config } from "../config";
import "./styles/CallToAction.css";

const CallToAction = () => {
  return (
    <div className="cta-section">
      <div className="cta-buttons">
        <a
          href="/myworks"
          className="cta-btn cta-btn-works"
          data-cursor="disable"
          onClick={() => { window.location.href = "/myworks"; }}
        >
          See All Works →
        </a>
        <a 
          href={config.contact.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cta-btn cta-btn-hire"
          data-cursor="disable"
        >
          Hire Me →
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
