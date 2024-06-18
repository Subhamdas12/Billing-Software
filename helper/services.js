const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const fs = require("fs");
const passport = require("passport");
exports.sanitizeUser = (user) => {
  return {
    name: user.name,
    role: user.role,
    id: user._id,
    phoneNumber: user.phoneNumber,
    email: user.email,
  };
};

exports.isAuth = () => {
  return passport.authenticate("jwt");
};

exports.cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

exports.generatePdf = (invoice) => {
  const data = convertToTableData(invoice);

  const doc = new jsPDF();

  // Add heading
  doc.setFontSize(16);
  doc.text("MUKTI FRESH", doc.internal.pageSize.getWidth() / 2, 10, {
    align: "center",
  });
  doc.setFontSize(12);
  doc.text(
    "22 Canal Side Road, Garia, Kolkata - 700084",
    doc.internal.pageSize.getWidth() / 2,
    20,
    { align: "center" }
  );
  doc.text(
    "GST - 19AAZFM6050B1Z0 | Call +91 9907099099 | Website - www.muktifresh.in",
    doc.internal.pageSize.getWidth() / 2,
    30,
    { align: "center" }
  );
  doc.text(
    `Invoice No - ${invoice._id.toString()}`,
    doc.internal.pageSize.getWidth() / 2,
    40,
    { align: "center" }
  );
  doc.text(
    `Housing Complex - ${invoice.customer.housingComplex.toString()}`,
    doc.internal.pageSize.getWidth() / 2,
    50,
    { align: "center" }
  );
  doc.text(
    `Billing Date - ${formatDate(invoice.createdAt).toString()}`,
    doc.internal.pageSize.getWidth() / 2,
    60,
    { align: "center" }
  );

  // Add some space before the table
  doc.setFontSize(12);
  doc.text(" ", 10, 20);

  // Define the table columns and rows
  const columns = ["Sl No", "Product Name", "Rate", "Qty", "Unit", "Amount"];
  const rows = data;

  // Add the table
  doc.autoTable({
    startY: 80, // Adjust startY to position the table
    head: [columns],
    body: rows,
  });
  const finalY = doc.previousAutoTable.finalY + 10;
  doc.text(
    `Total Amount - ${invoice.totalAmount.toString()}`,
    doc.internal.pageSize.getWidth() / 2,
    finalY,
    { align: "center" }
  );
  doc.text(
    `Total Amount In Words - ${numberToWords(invoice.totalAmount).toString()}`,
    doc.internal.pageSize.getWidth() / 2,
    finalY + 10,
    { align: "center" }
  );

  // Generate the PDF and save it
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  const filePath = `pdfs/${invoice.id.toString()}_${Date.now()}_invoice.pdf`;
  fs.writeFile(filePath, pdfBuffer, (err) => {
    if (err) {
      console.error("Error saving PDF:", err);
    } else {
      console.log("PDF saved successfully.");
    }
  });
  return `http://localhost:8080/download?file=${encodeURIComponent(filePath)}`;
};

function convertToTableData(order) {
  const columns = ["Sl No", "Product Name", "Rate", "Qty", "Unit", "Amount"];
  let tableData = [];
  order.product.forEach((product, index) => {
    const rate = order.rate.find(
      (r) => r._id.toString() === product._id.toString()
    ).rate;
    const quantity = order.quantity.find(
      (q) => q._id.toString() === product._id.toString()
    ).quantity;

    const amount = rate * quantity;

    tableData.push([
      (index + 1).toString(), // Sl No
      product.name, // Product Name
      rate.toString(), // Rate
      quantity.toString(), // Qty
      product.unit, // Unit
      amount.toString(), // Amount
    ]);
  });

  return tableData;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
}

function numberToWords(num) {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertToWords(n) {
    if (n < 20) return a[n];
    const digit = n % 10;
    if (n < 100) return b[Math.floor(n / 10)] + (digit ? " " + a[digit] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 === 0 ? "" : " and " + convertToWords(n % 100))
      );
    return (
      convertToWords(Math.floor(n / 1000)) +
      " Thousand" +
      (n % 1000 !== 0 ? " " + convertToWords(n % 1000) : "")
    );
  }

  const [rupees, paisa] = num.toFixed(2).split(".").map(Number);
  const rupeesInWords = rupees ? convertToWords(rupees) + " Rupees" : "";
  const paisaInWords = paisa ? convertToWords(paisa) + " paisa" : "";

  return (
    rupeesInWords +
    (rupeesInWords && paisaInWords ? " and " : "") +
    paisaInWords
  );
}

// {
//   _id: new ObjectId('66714fa6a4352325e3f73984'),
//   user: new ObjectId('667039eba0d86b88236ebb06'),
//   customer: {
//     _id: new ObjectId('66701ba27b76c9f1d6fdc66c'),
//     name: 'Ipsum',
//     housingComplex: 'Houising',
//     phoneNumber: '8888477954',
//     flatNumber: 'sojenfgo',
//     invoices: [],
//     __v: 0
//   },
//   product: [
//     {
//       _id: new ObjectId('666fe5305dc6182f01ff29a2'),
//       name: 'Fresh Desi MOUROLA',
//       rate: 175,
//       unit: 'gm',
//       category: new ObjectId('666fdb4b5c4f1296f1bed8f5'),
//       __v: 0
//     },
//     {
//       _id: new ObjectId('666fe5b12dda48660d413dee'),
//       name: 'Organic Masoor Dal ',
//       rate: 29,
//       unit: 'gm',
//       category: new ObjectId('666fdb575c4f1296f1bed8f7'),
//       __v: 0
//     }
//   ],
//   rate: [
//     { _id: '666fe5305dc6182f01ff29a2', rate: 175 },
//     { _id: '666fe5b12dda48660d413dee', rate: 29 }
//   ],
//   quantity: [
//     { _id: '666fe5305dc6182f01ff29a2', quantity: '2' },
//     { _id: '666fe5b12dda48660d413dee', quantity: '1' }
//   ],
//   totalAmount: 379,
//   createdAt: 2024-06-18T09:13:10.521Z,
//   updatedAt: 2024-06-18T09:13:10.521Z,
//   __v: 0
// }
