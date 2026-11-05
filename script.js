const fields = {
  purchase: document.getElementById("purchasePrice"),
  sale: document.getElementById("salePrice"),
  shipping: document.getElementById("shippingCost"),
  packaging: document.getElementById("packagingCost"),
  marketplace: document.getElementById("marketplaceFee"),
  fixed: document.getElementById("fixedFee"),
  promotion: document.getElementById("promotionFee"),
  other: document.getElementById("otherCosts")
};

const outputs = {
  profit: document.getElementById("netProfit"),
  message: document.getElementById("resultMessage"),
  margin: document.getElementById("profitMargin"),
  roi: document.getElementById("roi"),
  purchase: document.getElementById("outPurchase"),
  shipping: document.getElementById("outShipping"),
  packaging: document.getElementById("outPackaging"),
  marketplace: document.getElementById("outMarketplace"),
  fixed: document.getElementById("outFixed"),
  promotion: document.getElementById("outPromotion"),
  other: document.getElementById("outOther"),
  total: document.getElementById("totalCosts"),
  tip: document.getElementById("resultTip")
};

const money = value => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD"
}).format(value);

const read = input => {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) && value >= 0 ? value : 0;
};

function calculate() {
  const purchase = read(fields.purchase);
  const sale = read(fields.sale);
  const shipping = read(fields.shipping);
  const packaging = read(fields.packaging);
  const marketplaceRate = read(fields.marketplace);
  const fixed = read(fields.fixed);
  const promotionRate = read(fields.promotion);
  const other = read(fields.other);

  // These percentage fees are modeled against the sale price.
  const marketplace = sale * marketplaceRate / 100;
  const promotion = sale * promotionRate / 100;
  const total = purchase + shipping + packaging + marketplace + fixed + promotion + other;
  const profit = sale - total;
  const margin = sale > 0 ? (profit / sale) * 100 : 0;
  const invested = purchase + shipping + packaging + other;
  const roi = invested > 0 ? (profit / invested) * 100 : 0;

  outputs.profit.textContent = money(profit);
  outputs.profit.classList.toggle("negative", profit < 0);
  outputs.margin.textContent = `${margin.toFixed(1)}%`;
  outputs.roi.textContent = `${roi.toFixed(1)}%`;
  outputs.purchase.textContent = money(purchase);
  outputs.shipping.textContent = money(shipping);
  outputs.packaging.textContent = money(packaging);
  outputs.marketplace.textContent = money(marketplace);
  outputs.fixed.textContent = money(fixed);
  outputs.promotion.textContent = money(promotion);
  outputs.other.textContent = money(other);
  outputs.total.textContent = money(total);

  if (sale <= 0) {
    outputs.message.textContent = "Enter a sale price to calculate your estimate.";
    outputs.tip.innerHTML = "<span>ⓘ</span><p><strong>Add a sale price.</strong> Enter an expected selling price to see your estimated profit and return.</p>";
  } else if (profit > 0) {
    outputs.message.textContent = "That's what you keep after estimated costs.";
    outputs.tip.innerHTML = "<span>✦</span><p><strong>Positive estimated profit.</strong> Remember to account for taxes, returns, and any costs not entered above.</p>";
  } else if (profit === 0) {
    outputs.message.textContent = "You're at break-even based on these inputs.";
    outputs.tip.innerHTML = "<span>ⓘ</span><p><strong>Break-even.</strong> Your sale price covers the costs entered, but leaves no estimated profit.</p>";
  } else {
    outputs.message.textContent = "Your estimated costs are higher than your sale price.";
    outputs.tip.innerHTML = "<span>!</span><p><strong>You're in the red.</strong> Consider a lower purchase price, a higher sale price, or reducing costs.</p>";
  }
}

Object.values(fields).forEach(input => {
  input.addEventListener("input", calculate);
});

document.getElementById("resetButton").addEventListener("click", () => {
  fields.purchase.value = "20";
  fields.sale.value = "65";
  fields.shipping.value = "7";
  fields.packaging.value = "1.50";
  fields.marketplace.value = "13.6";
  fields.fixed.value = "0.40";
  fields.promotion.value = "0";
  fields.other.value = "0";
  calculate();
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
