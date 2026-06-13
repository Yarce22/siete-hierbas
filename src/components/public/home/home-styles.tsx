export function HomeStyles() {
  return (
    <style>{`
      @keyframes sh-word-reveal {
        from { transform: translateY(110%); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
      @keyframes sh-fade-up {
        from { opacity: 0; transform: translateY(30px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes sh-mesh-pulse {
        0%, 100% { opacity: 0.6; }
        50%       { opacity: 0.8; }
      }
      @keyframes sh-float-leaf {
        0%, 100% { transform: translateY(0) rotate(-5deg); }
        50%       { transform: translateY(-18px) rotate(5deg); }
      }
      @keyframes sh-line-grow {
        from { height: 0; }
        to   { height: 40px; }
      }
      .sh-hero-word-inner {
        display: inline-block;
        animation: sh-word-reveal 1.1s cubic-bezier(0.16,1,0.3,1) both;
      }
      .sh-product-card:hover .sh-card-img { transform: scale(1.07); }
      .sh-product-card:hover .sh-card-overlay { opacity: 1; }
      .sh-exp-card:hover {
        border-color: rgba(201,146,58,0.3) !important;
        background: var(--sh-forest) !important;
        transform: translateY(-6px);
      }
    `}</style>
  );
}
