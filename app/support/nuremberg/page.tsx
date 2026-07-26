"use client";

import { useState } from "react";
import styles from "./page.module.css";

const COLORS = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "Navy Blue", hex: "#1c2a4a" },
  { name: "Olive Green", hex: "#4a5741" },
];

const SIZES = [34, 36, 38, 40];

export default function Nuremberg() {
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedSize, setSelectedSize] = useState(36);

  return (
    <>
      <div className={styles.productPage}>
        {/* Hero image panel */}
        <div className="{styles.productHero}, pt-2">
          <span className={styles.productHeroGhost} aria-hidden="true">SS</span>
          <img
            src=".././coollokinglapel.jpg"
            alt="Cool Looking Lapel"
          />
        </div>

        {/* Body: title col + options col */}
        <div className={styles.productBody}>

          {/* Left: title, meta, description */}
          <div className={styles.productTitleCol}>
            <h1 className={styles.productTitle}>
              Cool<br />
              Looking<br />
              Lapel
            </h1>

            <div className={styles.accentLine} />

            <div className={styles.pillRow}>
              <span className={`${styles.pill} ${styles.pillBrand}`}>Adidolf SS Series</span>
              <span className={`${styles.pill} ${styles.pillStock}`}>In Stock</span>
            </div>

            <span className={styles.productPrice}>$4,000,000</span>

            <div className={styles.productSep} />

            <p className={styles.productDesc}>
              This will make you feel very cool. The definitive lapel — for
              those who walk in first and leave last. Crafted for distinction
              in every detail.
            </p>
          </div>

          {/* Right: selectors + actions */}
          <div className={styles.productOptsCol}>

            {/* Color */}
            <div>
              <div className={styles.fieldLabel}>Color — {selectedColor}</div>
              <div className={styles.swatches}>
                {COLORS.map(({ name, hex }) => (
                  <button
                    key={name}
                    className={`${styles.swatchBtn} ${selectedColor === name ? styles.active : ""}`}
                    style={{ background: hex }}
                    onClick={() => setSelectedColor(name)}
                    title={name}
                    aria-label={name}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className={styles.fieldLabel}>Size</div>
              <div className={styles.sizeBtns}>
                {SIZES.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.active : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actionRow}>
              <button className={styles.btnWish} aria-label="Save to wishlist">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button className={styles.btnCart}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Add to Cart
              </button>
            </div>

            {/* Perks */}
            <div className={styles.perks}>
              <div className={styles.perkRow}>
                <span>Free shipping on all orders</span>
                <span className={styles.perkCheck}>✓</span>
              </div>
              <div className={styles.perkRow}>
                <span>Free returns within 30 days</span>
                <span className={styles.perkCheck}>✓</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}