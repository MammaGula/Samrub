import { Icon } from '@iconify/react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Section A: Open Hours */}
        <div className="footer-hours">
          <p>
            Open Hours
            <br /><br />
            Mondays - Fridays<br />
            11-15, 17-21
            <br /><br />
            Saturdays - Sundays 13-21
          </p>
        </div>

        {/* Section B: Follow us 
        - target="_blank" opens link in new tab
        - rel="noreferrer" for security reasons */}
        <div className="footer-social">
          <p className="footer-follow-label">Follow us:</p>
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Icon icon="mdi:instagram" className="social-icon instagram-icon" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Icon icon="mdi:facebook" className="social-icon facebook-icon" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
              <Icon icon="ic:baseline-tiktok" className="social-icon tiktok-icon" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
