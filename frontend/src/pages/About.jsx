import Header from '../components/Header';
import Footer from '../components/Footer';
import './About.css';
import mojibolaPhoto from '../assets/mojibola-adebowale.jpg';

const About = () => {
    return (
        <div>
            <Header />
            <main className="about-page">
                <div className="container">
                    <div className="about-content">
                        <h1>About Abella Stitches</h1>

                        <div className="about-section designer-profile">
                            <div className="designer-content">
                                <div className="designer-image">
                                    <img
                                        src={mojibolaPhoto}
                                        alt="Mojibola Adebowale - CEO and Fashion Designer"
                                    />
                                </div>
                                <div className="designer-text">
                                    <h2>Meet the Designer</h2>
                                    <h3>Mojibola Adebowale</h3>
                                    <p className="designer-title">CEO & Fashion Designer</p>
                                    <p>
                                        With a passion for celebrating African heritage through contemporary design,
                                        Mojibola Adebowale founded Abella Stitches to bring vibrant, authentic African
                                        fashion to the world stage. Her unique vision combines traditional craftsmanship
                                        with modern aesthetics, creating pieces that honor cultural roots while embracing
                                        contemporary style.
                                    </p>
                                    <p>
                                        Each design at Abella Stitches reflects Mojibola's commitment to quality,
                                        authenticity, and the celebration of African textile arts. From hand-dyed Adire
                                        to bold Ankara prints, every piece tells a story of cultural pride and artistic
                                        excellence.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="about-section">
                            <h2>Our Story</h2>
                            <p>
                                Abella Stitches was born from a vision to celebrate African heritage through
                                contemporary design. We believe that fashion is more than just clothing—it's a
                                powerful expression of culture, identity, and creativity.
                            </p>
                            <p>
                                Our journey began with a simple mission: to bring the rich traditions of African
                                textile arts into the modern fashion landscape. From the vibrant patterns of Ankara
                                to the timeless beauty of hand-dyed Adire, each piece in our collection tells a story
                                of craftsmanship, culture, and care.
                            </p>
                        </div>

                        <div className="about-section">
                            <h2>Our Craftsmanship</h2>
                            <p>
                                We work closely with skilled artisans who use traditional techniques
                                passed down through generations. Every Adire piece is hand-dyed using ancient
                                indigo methods, while our Ankara fabrics feature bold, contemporary prints that
                                honor cultural motifs.
                            </p>
                            <p>
                                Quality is at the heart of everything we do. We source premium materials and
                                ensure ethical production practices, creating pieces that are both beautiful
                                and sustainable.
                            </p>
                        </div>

                        <div className="about-section">
                            <h2>Our Mission</h2>
                            <p>
                                We're on a mission to make African fashion accessible to the world while
                                supporting local communities and preserving traditional crafts. By choosing
                                Abella Stitches, you're not just buying clothing—you're investing in cultural
                                heritage and supporting artisan livelihoods.
                            </p>
                        </div>

                        <div className="about-values">
                            <div className="value-card">
                                <h3>🌍 Cultural Pride</h3>
                                <p>Celebrating African heritage through every design</p>
                            </div>
                            <div className="value-card">
                                <h3>✨ Quality Craftsmanship</h3>
                                <p>Handcrafted pieces made with traditional techniques</p>
                            </div>
                            <div className="value-card">
                                <h3>🤝 Ethical Production</h3>
                                <p>Supporting artisans and sustainable practices</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default About;
