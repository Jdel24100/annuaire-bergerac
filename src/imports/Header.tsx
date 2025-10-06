import svgPaths from "./svg-vs3dxhtkbk";
import imgAnnuaireBergeracLogo from "figma:asset/7b146016cd6f84b60d6e58e372c9dff34ba2c734.png";

function AnnuaireBergeracLogo() {
  return (
    <div className="h-[32px] max-w-[73.27px] relative shrink-0 w-[73.27px]" data-name="Annuaire Bergerac Logo">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAnnuaireBergeracLogo} />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <AnnuaireBergeracLogo />
    </div>
  );
}

function Frame() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[16px]" data-name="Frame">
      <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5%_-5.56%]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
            <path d={svgPaths.pe0f380} id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-[37.5%] right-[37.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-10%_-16.67%]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 9">
            <path d="M1 7.66667V1H5V7.66667" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Frame />
    </div>
  );
}

function SvgMargin() {
  return (
    <div className="box-border content-stretch flex flex-col h-[16px] items-start pl-0 pr-[8px] py-0 relative shrink-0 w-[24px]" data-name="SVG:margin">
      <Svg />
    </div>
  );
}

function Link1() {
  return (
    <div className="box-border content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Link">
      <SvgMargin />
      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#020817] text-[0px] text-center text-nowrap">
        <p className="leading-[20px] text-[14px] whitespace-pre">Accueil</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[16px]" data-name="Frame">
      <div className="absolute inset-[12.5%_20.83%_20.83%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-6.25%]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
            <path d={svgPaths.p302e1300} id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[69.58%_12.5%_12.5%_69.58%]" data-name="Vector">
        <div className="absolute inset-[-23.256%]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
            <path d="M3.86667 3.86667L1 1" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Frame1 />
    </div>
  );
}

function SvgMargin1() {
  return (
    <div className="box-border content-stretch flex flex-col h-[16px] items-start pl-0 pr-[8px] py-0 relative shrink-0 w-[24px]" data-name="SVG:margin">
      <Svg1 />
    </div>
  );
}

function Link2() {
  return (
    <div className="box-border content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Link">
      <SvgMargin1 />
      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#020817] text-[14px] text-center text-nowrap">
        <p className="leading-[20px] whitespace-pre">Recherche</p>
      </div>
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="box-border content-stretch flex flex-col h-[40px] items-start pl-[4px] pr-0 py-0 relative shrink-0" data-name="Link:margin">
      <Link2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[16px]" data-name="Frame">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 15">
            <path d={svgPaths.p357c3500} id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-[37.5%] right-[37.5%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-25%_-16.67%]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 5">
            <path d="M1 3.66667V1H5V3.66667" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[66.63%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-0.667px]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
            <path d="M1 1H1.00667" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[66.67%] right-[33.29%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-0.667px]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
            <path d="M1 1H1.00667" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-1/2 right-[49.96%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-0.667px]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
            <path d="M1 1H1.00667" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[58.33%] left-1/2 right-[49.96%] top-[41.67%]" data-name="Vector">
        <div className="absolute inset-[-0.667px]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
            <path d="M1 1H1.00667" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[41.67%] left-1/2 right-[49.96%] top-[58.33%]" data-name="Vector">
        <div className="absolute inset-[-0.667px]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
            <path d="M1 1H1.00667" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_33.29%_58.33%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-0.667px]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
            <path d="M1 1H1.00667" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[58.33%_33.29%_41.67%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-0.667px]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
            <path d="M1 1H1.00667" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_66.63%_58.33%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.667px]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
            <path d="M1 1H1.00667" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[58.33%_66.63%_41.67%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.667px]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
            <path d="M1 1H1.00667" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Frame2 />
    </div>
  );
}

function SvgMargin2() {
  return (
    <div className="box-border content-stretch flex flex-col h-[16px] items-start pl-0 pr-[8px] py-0 relative shrink-0 w-[24px]" data-name="SVG:margin">
      <Svg2 />
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function ButtonMenu() {
  return (
    <div className="box-border content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Button menu">
      <SvgMargin2 />
      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#020817] text-[14px] text-center text-nowrap">
        <p className="leading-[20px] whitespace-pre">Catégories</p>
      </div>
      <Svg3 />
    </div>
  );
}

function ButtonMenuMargin() {
  return (
    <div className="box-border content-stretch flex flex-col h-[40px] items-start pl-[4px] pr-0 py-0 relative shrink-0" data-name="Button menu:margin">
      <ButtonMenu />
    </div>
  );
}

function Frame3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[16px]" data-name="Frame">
      <div className="absolute inset-[8.333%]" data-name="Vector">
        <div className="absolute inset-[-5%]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <path d={svgPaths.p3f1e8fc0} id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[41.67%] left-[41.67%] right-1/4 top-[58.33%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-12.5%]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 2">
            <path d="M6.33333 1H1" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[41.67%] right-[37.5%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-20%]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 2">
            <path d="M4.33333 1H1" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[58.33%] left-[41.67%] right-1/4 top-1/4" data-name="Vector">
        <div className="absolute inset-[-25%_-12.5%]" style={{ "--stroke-0": "rgba(2, 8, 23, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 5">
            <path d="M1 1H6.33333V3.66667H1V1Z" id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Frame3 />
    </div>
  );
}

function SvgMargin3() {
  return (
    <div className="box-border content-stretch flex flex-col h-[16px] items-start pl-0 pr-[8px] py-0 relative shrink-0 w-[24px]" data-name="SVG:margin">
      <Svg4 />
    </div>
  );
}

function Link3() {
  return (
    <div className="box-border content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Link">
      <SvgMargin3 />
      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#020817] text-[14px] text-center text-nowrap">
        <p className="leading-[20px] whitespace-pre">Blog</p>
      </div>
    </div>
  );
}

function LinkMargin1() {
  return (
    <div className="box-border content-stretch flex flex-col h-[40px] items-start pl-[4px] pr-0 py-0 relative shrink-0" data-name="Link:margin">
      <Link3 />
    </div>
  );
}

function Nav() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Nav">
      <Link1 />
      <LinkMargin />
      <ButtonMenuMargin />
      <LinkMargin1 />
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.pccb100} id="Vector" stroke="var(--stroke-0, #020817)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[40px]" data-name="Button">
      <Svg5 />
    </div>
  );
}

function Link4() {
  return (
    <div className="box-border content-stretch flex h-[40px] items-center justify-center mr-[-0.01px] px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Link">
      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#020817] text-[14px] text-center text-nowrap">
        <p className="leading-[20px] whitespace-pre">Connexion</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="bg-blue-600 box-border content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Link">
      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-slate-50">
        <p className="leading-[20px] whitespace-pre">Inscription</p>
      </div>
    </div>
  );
}

function LinkMargin2() {
  return (
    <div className="box-border content-stretch flex flex-col h-[40px] items-start mr-[-0.01px] pl-[8px] pr-0 py-0 relative shrink-0" data-name="Link:margin">
      <Link5 />
    </div>
  );
}

function Container() {
  return (
    <div className="box-border content-stretch flex items-center pl-0 pr-[0.01px] py-0 relative shrink-0" data-name="Container">
      <Link4 />
      <LinkMargin2 />
    </div>
  );
}

function Margin() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pl-[8px] pr-0 py-0 relative shrink-0" data-name="Margin">
      <Container />
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Margin1() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pl-[8px] pr-0 py-0 relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[20px] whitespace-pre">Ajouter</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="box-border content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[6px] shrink-0" data-name="Link">
      <Svg6 />
      <Margin1 />
    </div>
  );
}

function LinkMargin3() {
  return (
    <div className="box-border content-stretch flex flex-col h-[40px] items-start pl-[8px] pr-0 py-0 relative shrink-0" data-name="Link:margin">
      <Link6 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Button />
      <Margin />
      <LinkMargin3 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex h-[64px] items-center justify-between relative shrink-0" data-name="Container">
      <Link />
      <Nav />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="box-border content-stretch flex flex-col items-start max-w-[1400px] min-w-[1400px] px-[16px] py-0 relative shrink-0" data-name="Container">
      <Container2 />
    </div>
  );
}

export default function Header() {
  return (
    <div className="backdrop-blur-[5px] backdrop-filter bg-[rgba(255,255,255,0.1)] relative size-full" data-name="Header">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col items-center px-[260px] py-px relative size-full">
          <Container3 />
        </div>
      </div>
    </div>
  );
}