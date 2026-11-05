const fields = {
  purchase: document.getElementById("purchasePrice"),
  sale: document.getElementById("salePrice"),
  buyerShipping: document.getElementById("buyerShipping"),
  shipping: document.getElementById("shippingCost"),
  packaging: document.getElementById("packagingCost"),
  marketplace: document.getElementById("marketplaceFee"),
  fixed: document.getElementById("fixedFee"),
  promotion: document.getElementById("promotionFee"),
  listing: document.getElementById("listingFee"),
  other: document.getElementById("otherCosts")
};

const outputs = {
  profit: document.getElementById("netProfit"),
  message: document.getElementById("resultMessage"),
  margin: document.getElementById("profitMargin"),
  roi: document.getElementById("roi"),
  purchase: document.getElementById("outPurchase"),
  buyerShipping: document.getElementById("outBuyerShipping"),
  shipping: document.getElementById("outShipping"),
  packaging: document.getElementById("outPackaging"),
  marketplace: document.getElementById("outMarketplace"),
  fixed: document.getElementById("outFixed"),
  promotion: document.getElementById("outPromotion"),
  listing: document.getElementById("outListing"),
  other: document.getElementById("outOther"),
  total: document.getElementById("totalCosts"),
  breakEven: document.getElementById("breakEvenPrice"),
  tip: document.getElementById("resultTip")
};

const preset = document.getElementById("marketplacePreset");
const money = value => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD"
}).format(value);

const read = input => {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
};

let currentResult = null;

function applyPreset() {
  const choice = preset.value;
  if (choice === "ebay") {
    fields.marketplace.value = "13.6";
    fields.fixed.value = read(fields.sale) + read(fields.buyerShipping) <= 10 ? "0.30" : "0.40";
    fields.listing.value = "0";
  } else if (choice === "etsy") {
    // US Etsy Payments: 6.5% transaction + 3% processing,
    // plus $0.25 processing and $0.20 listing fee.
    fields.marketplace.value = "9.5";
    fields.fixed.value = "0.25";
    fields.listing.value = "0.20";
  }
  calculate();
}

function calculate() {
  const purchase = read(fields.purchase);
  const sale = read(fields.sale);
  const buyerShipping = read(fields.buyerShipping);
  const shipping = read(fields.shipping);
  const packaging = read(fields.packaging);
  const marketplaceRate = read(fields.marketplace);
  let fixed = read(fields.fixed);
  const promotionRate = read(fields.promotion);
  const listing = read(fields.listing);
  const other = read(fields.other);

  // eBay's per-order fee is $0.30 at $10 or less and $0.40 above $10.
  // This preset is a simplified estimate for most categories without a Store.
  if (preset.value === "ebay") {
    fixed = sale + buyerShipping <= 10 ? 0.30 : 0.40;
    fields.fixed.value = fixed.toFixed(2);
  }

  // Percentage fees are modeled on item price + buyer-paid shipping.
  // Sales tax and platform-specific exceptions are not modeled.
  const feeBase = sale + buyerShipping;
  const marketplace = feeBase * marketplaceRate / 100;
  const promotion = feeBase * promotionRate / 100;
  const revenue = feeBase;
  const totalCosts = purchase + shipping + packaging + marketplace + fixed + promotion + listing + other;
  const profit = revenue - totalCosts;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const invested = purchase + shipping + packaging + listing + other;
  const roi = invested > 0 ? (profit / invested) * 100 : 0;

  const combinedRate = (marketplaceRate + promotionRate) / 100;
  const fixedCosts = purchase + shipping + packaging + fixed + listing + other;
  const breakEvenTotalRevenue = combinedRate < 1 ? fixedCosts / (1 - combinedRate) : Infinity;
  const breakEvenItemPrice = breakEvenTotalRevenue - buyerShipping;

  outputs.profit.textContent = money(profit);
  outputs.profit.classList.toggle("negative", profit < 0);
  outputs.margin.textContent = `${margin.toFixed(1)}%`;
  outputs.roi.textContent = `${roi.toFixed(1)}%`;
  outputs.purchase.textContent = money(purchase);
  outputs.buyerShipping.textContent = money(buyerShipping);
  outputs.shipping.textContent = money(shipping);
  outputs.packaging.textContent = money(packaging);
  outputs.marketplace.textContent = money(marketplace);
  outputs.fixed.textContent = money(fixed);
  outputs.promotion.textContent = money(promotion);
  outputs.listing.textContent = money(listing);
  outputs.other.textContent = money(other);
  outputs.total.textContent = money(totalCosts);
  outputs.breakEven.textContent = Number.isFinite(breakEvenItemPrice) ? money(Math.max(0, breakEvenItemPrice)) : "Not possible";

  if (sale + buyerShipping <= 0) {
    outputs.message.textContent = "Enter a sale price to calculate your estimate.";
    outputs.tip.innerHTML = "<span>ⓘ</span><p><strong>Add a sale price.</strong> Enter an expected selling price to see your estimated profit and return.</p>";
  } else if (profit > 0) {
    outputs.message.textContent = "That's what you keep after estimated costs.";
    outputs.tip.innerHTML = "<span>✦</span><p><strong>Positive estimated profit.</strong> Remember to account for taxes, returns, and any costs not entered above.</p>";
  } else if (profit === 0) {
    outputs.message.textContent = "You're at break-even based on these inputs.";
    outputs.tip.innerHTML = "<span>ⓘ</span><p><strong>Break-even.</strong> Your sale proceeds cover the costs entered, but leave no estimated profit.</p>";
  } else {
    outputs.message.textContent = "Your estimated costs are higher than your sale proceeds.";
    outputs.tip.innerHTML = "<span>!</span><p><strong>You're in the red.</strong> Consider a lower purchase price, a higher sale price, or reducing costs.</p>";
  }

  currentResult = {
    profit, margin, roi, purchase, sale, buyerShipping, shipping, packaging,
    marketplace, fixed, promotion, listing, other, totalCosts, breakEvenItemPrice
  };
}

Object.values(fields).forEach(input => {
  input.addEventListener("input", () => {
    if (preset.value === "ebay" && (input === fields.sale || input === fields.buyerShipping)) {
      // Recalculate eBay's order fee threshold when price changes.
      calculate();
    } else {
      if (input === fields.marketplace || input === fields.fixed || input === fields.promotion || input === fields.listing) {
        preset.value = "custom";
      }
      calculate();
    }
  });
});

preset.addEventListener("change", applyPreset);

document.getElementById("resetButton").addEventListener("click", () => {
  fields.purchase.value = "20";
  fields.sale.value = "65";
  fields.buyerShipping.value = "0";
  fields.shipping.value = "7";
  fields.packaging.value = "1.50";
  fields.marketplace.value = "13.6";
  fields.fixed.value = "0.40";
  fields.promotion.value = "0";
  fields.listing.value = "0";
  fields.other.value = "0";
  preset.value = "custom";
  calculate();
});

const STORAGE_KEY = "flipmargin_saved_flips_v2";
const savedContainer = document.getElementById("savedFlips");
const nameInput = document.getElementById("flipName");

function getSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function renderSaved() {
  const saved = getSaved();
  savedContainer.innerHTML = "";
  if (!saved.length) {
    savedContainer.innerHTML = '<p class="saved-empty">Your saved calculations will appear here. They stay on this device and browser.</p>';
    return;
  }
  saved.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "saved-flip";
    const info = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = item.name;
    const sub = document.createElement("span");
    sub.textContent = `Sale ${money(item.sale)} · ROI ${item.roi.toFixed(1)}%`;
    info.append(title, sub);
    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.alignItems = "center";
    right.style.gap = "8px";
    const profit = document.createElement("strong");
    profit.className = "saved-profit";
    profit.textContent = money(item.profit);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.setAttribute("aria-label", `Delete ${item.name}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      const next = getSaved();
      next.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      renderSaved();
    });
    right.append(profit, remove);
    card.append(info, right);
    savedContainer.append(card);
  });
}

document.getElementById("saveFlipButton").addEventListener("click", () => {
  if (!currentResult) return;
  const name = nameInput.value.trim() || `Flip ${new Date().toLocaleDateString()}`;
  const saved = getSaved();
  saved.unshift({ name, sale: currentResult.sale, profit: currentResult.profit, roi: currentResult.roi });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved.slice(0, 12)));
  nameInput.value = "";
  renderSaved();
});

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
calculate();
renderSaved();
