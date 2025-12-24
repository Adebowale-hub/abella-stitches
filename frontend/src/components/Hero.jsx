import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    <div className="hero-left">
                        <h1 className="hero-title">Discover Contemporary African Fashion</h1>
                        <p className="hero-text">
                            Explore our curated collection of premium Ankara, traditional Adire,
                            and urban streetwear that celebrates African heritage with modern style.
                            Each piece tells a story of craftsmanship and cultural pride.
                        </p>
                        <div className="hero-ctas">
                            <a href="#catalog" className="btn btn-primary btn-large">Shop Collection</a>
                            <a href="#catalog" className="btn btn-outline btn-large">View Lookbook</a>
                        </div>
                    </div>

                    <div className="hero-image-container">
                        <img
                            src="/hero-dress.jpg"
                            alt="Abella Stitches elegant white dress design"
                            className="hero-image"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
