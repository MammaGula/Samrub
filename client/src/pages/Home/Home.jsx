import { useContext } from "react"; // to access foodList from StoreContext
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext"; // global state context for foodList
import "./Home.css";

// Strip 1 — static ingredient images (hardcoded, no need to fetch)
const INGREDIENT_IMAGES = [
  "/images/Ingredients/ingredient1.jpg",
  "/images/Ingredients/ingredient2.jpg",
  "/images/Ingredients/ingredient3.jpg",
  "/images/Ingredients/ingredient4.jpg",
  "/images/Ingredients/ingredient5.jpg",
  "/images/Ingredients/ingredient6.jpg",
  "/images/Ingredients/ingredient7.jpg",
];

const Home = () => {
  const navigate = useNavigate();
  const { foodList } = useContext(StoreContext); // Strip 2 — dynamic food dishes from db.json

  return (
    <div className="home">
      {/* ═══ 1. HERO ═══════════════════════════════════════════════ */}
      <section className="home__hero">
        {/* Frosted glass card on top of hero background image */}
        <div className="home__hero-card">
          <h1 className="home__hero-title">Where tradition meets taste</h1>
          <button className="home__hero-btn" onClick={() => navigate("/menu")}>
            View Menu
          </button>
        </div>
      </section>

      {/* ═══ 2. SHOW INGREDIENTS — scrolls LEFT ═════════════════════ */}
      {/* Static category images — hardcoded because they never change */}
      <section className="home__strip-wrapper">
        <div className="home__strip home__strip--left">
          {/* Duplicate for seamless loop */}
          {[...INGREDIENT_IMAGES, ...INGREDIENT_IMAGES].map((src, i) => (
            <img
              key={`ing-${i}`} // use index as key since these are static and won't change order or content
              src={src}
              alt=""
              className="home__strip-img"
              draggable={false} // prevent dragging images which can cause unwanted behavior in scrolling strips
            />
          ))}
        </div>
      </section>

      {/* ═══ 3. SHOW FOOD — scrolls RIGHT ═══════════════════════════ */}
      {/* Dynamic food dishes fetched from db.json via StoreContext */}
      <section className="home__strip-wrapper">
        <div className="home__strip home__strip--right">
          {/* Duplicate for seamless loop */}
          {[...foodList, ...foodList].map((item, i) => (
            <img
              key={`food-${i}`} // use index as key since these are dynamic but duplicated for seamless loop
              src={`/images/foods/${item.image}`}
              alt={item.name}
              className="home__strip-img"
              draggable={false} // prevent dragging images which can cause unwanted behavior in scrolling strips
            />
          ))}
        </div>
      </section>

      {/* ═══ 4. ABOUT / CONTENT ══════════════════════════════════════ */}
      <section className="home__about">
        <div className="home__about-content">
          <p className="home__about-body">
            Rooted in Thai culture and carried by tradition, our food reflects
            the true taste of Thailand. Every dish tells a story of heritage.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
