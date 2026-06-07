import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const jewelryModelSrc = "/models/ruby-diamond-gold-necklace.glb";

const metalFinishes = [
  {
    name: "White gold",
    metal: "#f4f6f4",
    modelColor: [0.96, 0.97, 0.94, 1],
    roughness: 0.1,
  },
  {
    name: "Yellow gold",
    metal: "#d8a640",
    modelColor: [1, 0.68, 0.22, 1],
    roughness: 0.18,
  },
  {
    name: "Rose gold",
    metal: "#c88973",
    modelColor: [1, 0.48, 0.36, 1],
    roughness: 0.2,
  },
];

const gemstoneFinishes = [
  {
    name: "Diamond",
    gem: "#f5fbff",
    modelColor: [1, 1, 1, 1],
    roughness: 0.18,
    exposure: 1.16,
    note: "Clear diamond stones with bright white fire.",
  },
  {
    name: "Sapphire",
    gem: "#214f9b",
    modelColor: [0.08, 0.22, 0.86, 1],
    roughness: 0.24,
    exposure: 1.12,
    note: "Deep blue sapphire stones with cool reflections.",
  },
  {
    name: "Emerald",
    gem: "#2ca46f",
    modelColor: [0.05, 0.68, 0.38, 1],
    roughness: 0.28,
    exposure: 1.1,
    note: "Emerald stones with a rich green glass-like tone.",
  },
  {
    name: "Ruby",
    gem: "#b7223b",
    modelColor: [0.86, 0.06, 0.12, 1],
    roughness: 0.26,
    exposure: 1.08,
    note: "Ruby stones with a saturated red jewel tone.",
  },
];

const bakedFinishSwatches = [
  { name: "18K 金", color: "#d8a640" },
  { name: "红宝石", color: "#b7223b" },
  { name: "钻石", color: "#f4f6f4" },
];

const collections = [
  {
    title: "曜影戒指",
    type: "白金戒托镶嵌钻石与祖母绿，适合订婚与周年纪念。",
    price: "起价 $4,900",
    image: "/images/jewelry/collection-eclipse.png",
  },
  {
    title: "星帆耳坠",
    type: "镜面抛光金质耳饰，垂坠钻石在步履间捕捉光线。",
    price: "起价 $3,400",
    image: "/images/jewelry/collection-vela.png",
  },
  {
    title: "珍珠光线",
    type: "甄选 Akoya 珍珠，手工串联成日常也能佩戴的柔光轮廓。",
    price: "起价 $2,800",
    image: "/images/jewelry/collection-pearl.png",
  },
];

const metrics = ["48 小时私人选品", "18K 责任金材", "甄选高级宝石"];

const applyModelMaterials = (viewer, metal, gemstone) => {
  const materials = viewer?.model?.materials;

  if (!materials?.length) return;

  if (materials.length === 1) {
    const bakedTextureMaterial = materials[0];

    bakedTextureMaterial?.pbrMetallicRoughness?.setBaseColorFactor([1, 1, 1, 1]);
    bakedTextureMaterial?.pbrMetallicRoughness?.setMetallicFactor?.(0.5);
    bakedTextureMaterial?.pbrMetallicRoughness?.setRoughnessFactor?.(0.04);
    viewer.exposure = 1.08;
    return;
  }

  const metalMaterial = materials.find((material) => material.name === "Material_1") ?? materials[0];
  const gemMaterial = materials.find((material) => material.name === "Material_3") ?? materials[1];

  metalMaterial?.pbrMetallicRoughness?.setBaseColorFactor(metal.modelColor);
  metalMaterial?.pbrMetallicRoughness?.setMetallicFactor?.(1);
  metalMaterial?.pbrMetallicRoughness?.setRoughnessFactor?.(metal.roughness);

  gemMaterial?.pbrMetallicRoughness?.setBaseColorFactor(gemstone.modelColor);
  gemMaterial?.pbrMetallicRoughness?.setMetallicFactor?.(0);
  gemMaterial?.pbrMetallicRoughness?.setRoughnessFactor?.(gemstone.roughness);

  viewer.exposure = gemstone.exposure;
};

const JewelryModel = ({ modelRef }) => (
  <div className="model-stage model-stage-compact model-interactive">
    <model-viewer
      ref={modelRef}
      className="jewelry-model-viewer"
      src={jewelryModelSrc}
      environment-image="/models/gem_2.hdr.png"
      exposure="1.12"
      shadow-intensity="0.45"
      camera-controls
      auto-rotate
      disable-zoom
      interaction-prompt="none"
      camera-orbit="-22deg 62deg auto"
      min-camera-orbit="auto 38deg auto"
      max-camera-orbit="auto 82deg auto"
      field-of-view="26deg"
      alt="Ruby diamond gold necklace"
    />
  </div>
);

const Nav = () => (
  <nav className="site-nav">
    <a className="brand-mark" href="#top" aria-label="Lume Atelier 首页">
      <img src="/images/jewelry/lume-mark.svg" alt="" />
      <span>Lume</span>
    </a>
    <div className="nav-links" aria-label="主导航">
      <a href="#atelier">工艺</a>
      <a href="#collections">系列</a>
      <a href="#custom">3D 鉴赏</a>
    </div>
    <a className="nav-action" href="#appointment">
      预约鉴赏
    </a>
  </nav>
);

function App() {
  const [metal, setMetal] = useState(metalFinishes[0]);
  const [gemstone, setGemstone] = useState(gemstoneFinishes[0]);
  const modelViewerRef = useRef(null);

  useEffect(() => {
    const viewer = modelViewerRef.current;
    const modelArea = document.querySelector(".model-interactive");
    viewer?.setAttribute("src", jewelryModelSrc);

    if (!modelArea) return undefined;

    const keepPageScrolling = (event) => {
      event.preventDefault();
      event.stopPropagation();
      window.scrollBy({
        top: event.deltaY,
        left: event.deltaX,
        behavior: "auto",
      });
    };

    modelArea.addEventListener("wheel", keepPageScrolling, {
      passive: false,
      capture: true,
    });

    return () => {
      modelArea.removeEventListener("wheel", keepPageScrolling, {
        capture: true,
      });
    };
  }, []);

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return undefined;

    const updateMaterial = () => applyModelMaterials(viewer, metal, gemstone);

    if (viewer.model) {
      updateMaterial();
    }

    viewer.addEventListener("load", updateMaterial);

    return () => {
      viewer.removeEventListener("load", updateMaterial);
    };
  }, [metal, gemstone]);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(".reveal-on-scroll", { opacity: 1, y: 0 });
      return;
    }

    gsap.set(".hero-mask", {
      maskPosition: "50% 44%",
      WebkitMaskPosition: "50% 44%",
      maskSize: "2600% 2600%",
      WebkitMaskSize: "2600% 2600%",
    });

    gsap.set(".reveal-lockup", { opacity: 0, y: 36 });
    gsap.set(".reveal-on-scroll", { opacity: 0, y: 54 });

    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "+=110%",
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
      },
    });

    heroTl
      .to(".hero-copy", { y: -110, opacity: 0.08, ease: "power1.inOut" })
      .to(
        ".hero-mask",
        {
          maskSize: "34% 34%",
          WebkitMaskSize: "34% 34%",
          ease: "power1.inOut",
        },
        "<"
      )
      .to(".reveal-lockup", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.1")
      .to(".hero-mask", { opacity: 0.2, duration: 0.5 }, "<");

    gsap.to(".atelier-image", {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: ".atelier-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
      },
    });

    gsap.to(".collection-card", {
      y: -80,
      stagger: 0.08,
      ease: "none",
      scrollTrigger: {
        trigger: ".collection-section",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 0.8,
      },
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".config-section",
        start: "top top",
        end: "+=80%",
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
      },
    })
      .to(".config-model", { scale: 1.05, rotate: 2, ease: "power1.inOut" })
      .to(".config-copy", { y: -32, ease: "power1.inOut" }, "<");

    gsap.utils.toArray(".reveal-on-scroll").forEach((item) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 84%",
        },
      });
    });
  }, []);

  return (
    <main
      id="top"
      style={{
        "--metal": metal.metal,
        "--gem": gemstone.gem,
      }}
    >
      <Nav />

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-mask">
          <img className="hero-editorial" src="/images/jewelry/hero-editorial.png" alt="" />
          <div className="hero-jewel" aria-hidden="true" />
        </div>

        <div className="hero-copy">
          <p className="eyebrow">高级珠宝工坊</p>
          <h1 id="hero-title">Lume Atelier</h1>
          <p>
            为重要时刻打造会被记住的珠宝。甄选钻石、红宝石与珍珠，
            以高级工艺呈现可传承的光芒。
          </p>
          <div className="hero-actions">
            <a href="#custom">查看 3D 珠宝</a>
            <a href="#collections">探索系列</a>
          </div>
        </div>

        <div className="reveal-lockup" aria-hidden="true">
          <img src="/images/jewelry/lume-word.svg" alt="" />
        </div>

        <div className="hero-bottom">
          {metrics.map((metric) => (
            <span key={metric}>{metric}</span>
          ))}
        </div>
      </section>

      <section className="atelier-section" id="atelier">
        <div className="section-heading reveal-on-scroll">
          <p className="eyebrow">工艺与选石</p>
          <h2>以宝石的火彩，回应每一次郑重选择。</h2>
        </div>
        <div className="atelier-grid">
          <div className="atelier-copy reveal-on-scroll">
            <p>
              每一件 Lume 珠宝都从选石开始。我们关注净度、切工、色泽与佩戴比例，
              让钻石的明亮、红宝石的深度和金属的温度在同一件作品里平衡。
            </p>
            <p>
              从日常佩戴到订婚、纪念日与私人礼赠，作品都以舒适结构和精细镶嵌完成，
              让珍贵不止停留在展示柜里。
            </p>
          </div>
          <figure className="atelier-figure">
            <img
              className="atelier-image"
              src="/images/jewelry/hero-editorial.png"
              alt="Diamond ring and earring on a display surface"
            />
          </figure>
        </div>
      </section>

      <section className="collection-section" id="collections">
        <div className="section-heading reveal-on-scroll">
          <p className="eyebrow">臻选系列</p>
          <h2>从第一眼心动，到日复一日佩戴。</h2>
        </div>
        <div className="collection-grid">
          {collections.map((item, index) => (
            <article className="collection-card" key={item.title}>
              <img src={item.image} alt={`${item.title} jewelry`} />
              <div className="collection-card-copy">
                <span>{`0${index + 1}`}</span>
                <h3>{item.title}</h3>
                <p>{item.type}</p>
                <strong>{item.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="config-section" id="custom">
        <div className="config-copy">
          <p className="eyebrow">在线鉴赏</p>
          <h2>在线旋转珠宝，提前看见佩戴时的光。</h2>
          <p>
            通过 3D 模型查看项链的层次、宝石位置与金属反射。红宝石的浓郁色泽、
            钻石的闪耀切面和 18K 金的温润光感，都可以在预约前先细看。
          </p>

          <div className="material-controls material-summary" aria-label="项链材质组成">
            {bakedFinishSwatches.map((item) => (
              <span className="finish-chip" key={item.name}>
                <span style={{ background: item.color }} />
                <strong>{item.name}</strong>
              </span>
            ))}
          </div>

          <p className="finish-note">18K 金镶嵌，红宝石主石，钻石点缀。</p>
        </div>

        <div className="config-model">
          <div className="model-glow" />
          <JewelryModel modelRef={modelViewerRef} />
          <div className="model-caption">拖拽旋转珠宝，滚动继续浏览页面。</div>
        </div>
      </section>

      <section className="editorial-section">
        <figure className="editorial-image reveal-on-scroll">
          <img
            src="/images/jewelry/collection-editorial.png"
            alt="Pearl necklace, diamond bracelet, and sapphire ring"
          />
        </figure>
        <div className="editorial-copy reveal-on-scroll">
          <p className="eyebrow">私人顾问</p>
          <h2>为你的场合，挑选一件刚刚好的珠宝。</h2>
          <p>
            我们提供私人选品与定制建议。无论是婚礼、纪念日、商务晚宴，
            还是一份值得珍藏的礼物，顾问都会根据预算、风格与佩戴场景推荐合适作品。
          </p>
        </div>
      </section>

      <section className="appointment-section" id="appointment">
        <div>
          <p className="eyebrow">Lume Atelier</p>
          <h2>预约一场私人珠宝鉴赏。</h2>
        </div>
        <a href="mailto:atelier@example.com">预约顾问</a>
      </section>
    </main>
  );
}

export default App;
