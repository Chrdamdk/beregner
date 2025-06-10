const Calculator = () => {
  // Grundlæggende økonomi
  const [monthlyWage, setMonthlyWage] = React.useState(45000);
  const [otherExpensesPercent, setOtherExpensesPercent] = React.useState(40);
  const [desiredProfitPercent, setDesiredProfitPercent] = React.useState(30);

  // Nye hjemmesider
  const [websitePrice, setWebsitePrice] = React.useState(35000);
  const [websitesPerMonth, setWebsitesPerMonth] = React.useState(1);

  // Vedligeholdelse & Hosting
  const [maintenancePrice, setMaintenancePrice] = React.useState(1200);
  const [maintenanceDeals, setMaintenanceDeals] = React.useState(1);
  const [hostingPrice, setHostingPrice] = React.useState(150);
  const [hostingCustomers, setHostingCustomers] = React.useState(1);

  // Marketing
  const [seoPrice, setSeoPrice] = React.useState(5000);
  const [seoDeals, setSeoDeals] = React.useState(0.5);
  const [googleAdsPrice, setGoogleAdsPrice] = React.useState(3000);
  const [googleAdsDeals, setGoogleAdsDeals] = React.useState(0.5);

  // Konsulentydelser
  const [consultingHourlyRate, setConsultingHourlyRate] = React.useState(1200);
  const [consultingHoursPerMonth, setConsultingHoursPerMonth] = React.useState(1);

  // Vækstprojektion
  const [projectionMonths, setProjectionMonths] = React.useState(24);
  const [churnRate, setChurnRate] = React.useState(2);
  const [newMaintenancePerMonth, setNewMaintenancePerMonth] = React.useState(1);
  const [newHostingPerMonth, setNewHostingPerMonth] = React.useState(1);
  const [newSeoPerMonth, setNewSeoPerMonth] = React.useState(0.5);
  const [newGoogleAdsPerMonth, setNewGoogleAdsPerMonth] = React.useState(0.5);

  // Beregninger
  const [results, setResults] = React.useState({});
  const [projectionData, setProjectionData] = React.useState([]);

  React.useEffect(() => {
    // Beregn månedlige indtægter
    const websiteRevenue = websitePrice * websitesPerMonth;
    const maintenanceRevenue = maintenancePrice * maintenanceDeals;
    const hostingRevenue = hostingPrice * hostingCustomers;
    const seoRevenue = seoPrice * seoDeals;
    const googleAdsRevenue = googleAdsPrice * googleAdsDeals;
    const consultingRevenue = consultingHourlyRate * consultingHoursPerMonth * maintenanceDeals;

    const totalRevenue = websiteRevenue + maintenanceRevenue + hostingRevenue + seoRevenue + googleAdsRevenue + consultingRevenue;

    // Beregn andre omkostninger
    const otherExpenses = (monthlyWage * otherExpensesPercent) / 100;
    
    // Beregn ønsket profit
    const desiredProfit = (monthlyWage * desiredProfitPercent) / 100;

    // Samlet månedlig omsætning nødvendig
    const requiredRevenue = monthlyWage + otherExpenses + desiredProfit;

    // Omsætningsfordeling i procent
    const getPercentage = (amount) => totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(0) : 0;

    // Generer vækstprojektion
    const generateProjection = () => {
      const data = [];
      let currentMaintenanceDeals = maintenanceDeals;
      let currentHostingCustomers = hostingCustomers;
      let currentSeoDeals = seoDeals;
      let currentGoogleAdsDeals = googleAdsDeals;

      const monthlyChurnRate = churnRate / 100;

      for (let month = 1; month <= projectionMonths; month++) {
        // Tilføj nye kunder/aftaler
        currentMaintenanceDeals += newMaintenancePerMonth;
        currentHostingCustomers += newHostingPerMonth;
        currentSeoDeals += newSeoPerMonth;
        currentGoogleAdsDeals += newGoogleAdsPerMonth;

        // Træk churn fra (kun for abonnementsydelser)
        currentMaintenanceDeals = currentMaintenanceDeals * (1 - monthlyChurnRate);
        currentHostingCustomers = currentHostingCustomers * (1 - monthlyChurnRate);
        currentSeoDeals = currentSeoDeals * (1 - monthlyChurnRate);
        currentGoogleAdsDeals = currentGoogleAdsDeals * (1 - monthlyChurnRate);

        // Sørg for at værdierne ikke går under 0
        currentMaintenanceDeals = Math.max(0, currentMaintenanceDeals);
        currentHostingCustomers = Math.max(0, currentHostingCustomers);
        currentSeoDeals = Math.max(0, currentSeoDeals);
        currentGoogleAdsDeals = Math.max(0, currentGoogleAdsDeals);

        // Månedlig omsætning for den måned
        const monthlyWebsiteRevenue = websitePrice * websitesPerMonth;
        const monthlyMaintenanceRevenue = maintenancePrice * currentMaintenanceDeals;
        const monthlyHostingRevenue = hostingPrice * currentHostingCustomers;
        const monthlySeoRevenue = seoPrice * currentSeoDeals;
        const monthlyGoogleAdsRevenue = googleAdsPrice * currentGoogleAdsDeals;
        const monthlyConsultingRevenue = consultingHourlyRate * consultingHoursPerMonth * currentMaintenanceDeals;

        const totalMonthlyRevenue = monthlyWebsiteRevenue + monthlyMaintenanceRevenue + monthlyHostingRevenue + monthlySeoRevenue + monthlyGoogleAdsRevenue + monthlyConsultingRevenue;

        data.push({
          month: `Måned ${month}`,
          totalOmsaetning: Math.round(totalMonthlyRevenue),
          noedvendigOmsaetning: Math.round(requiredRevenue),
          minimumskrav: Math.round(monthlyWage + otherExpenses),
          // Tilføj detaljerede data til tooltip
          vedligeholdelsesaftaler: currentMaintenanceDeals,
          hostingkunder: currentHostingCustomers,
          seoAftaler: currentSeoDeals,
          googleAdsAftaler: currentGoogleAdsDeals,
          konsulentTimer: consultingHoursPerMonth * currentMaintenanceDeals
        });
      }
      return data;
    };

    setResults({
      websiteRevenue,
      maintenanceRevenue,
      hostingRevenue,
      seoRevenue,
      googleAdsRevenue,
      consultingRevenue,
      totalRevenue,
      otherExpenses,
      desiredProfit,
      requiredRevenue,
      percentages: {
        websites: getPercentage(websiteRevenue),
        consulting: getPercentage(consultingRevenue),
        maintenance: getPercentage(maintenanceRevenue),
        seo: getPercentage(seoRevenue),
        googleAds: getPercentage(googleAdsRevenue),
        hosting: getPercentage(hostingRevenue)
      }
    });

    setProjectionData(generateProjection());
  }, [monthlyWage, otherExpensesPercent, desiredProfitPercent, websitePrice, websitesPerMonth, maintenancePrice, maintenanceDeals, hostingPrice, hostingCustomers, seoPrice, seoDeals, googleAdsPrice, googleAdsDeals, consultingHourlyRate, consultingHoursPerMonth, projectionMonths, churnRate, newMaintenancePerMonth, newHostingPerMonth, newSeoPerMonth, newGoogleAdsPerMonth]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const InputSection = ({ title, icon, children, bgColor = "bg-blue-50" }) => (
    React.createElement('div', { className: `${bgColor} border border-gray-200 rounded-lg p-6 mb-6` },
      React.createElement('h3', { className: "flex items-center text-lg font-semibold mb-4 text-gray-800" },
        React.createElement('span', { className: "mr-2" }, icon),
        title
      ),
      React.createElement('div', { className: "space-y-4" }, children)
    )
  );

  const InputRow = ({ label, value, onChange, step = 1, suffix = "" }) => (
    React.createElement('div', { className: "flex justify-between items-center" },
      React.createElement('label', { className: "text-gray-700 flex-1" }, label + ":"),
      React.createElement('div', { className: "flex items-center" },
        React.createElement('input', {
          type: "number",
          value: value,
          onChange: (e) => onChange(parseFloat(e.target.value) || 0),
          step: step,
          className: "w-24 px-3 py-2 border border-gray-300 rounded-md text-right mr-2"
        }),
        React.createElement('span', { className: "text-gray-600 w-16" }, suffix),
        React.createElement('span', { className: "w-20 text-right font-medium" },
          suffix.includes('%') ? '' : formatCurrency(
            suffix === 'kr.' ? value :
            label.includes('månedlig løn') ? value :
            label.includes('Andre lønomkostninger') ? (value * monthlyWage) / 100 :
            label.includes('Ønsket profit') ? (value * monthlyWage) / 100 :
            label.includes('Pris pr. hjemmeside') ? value * websitesPerMonth :
            label.includes('Antal pr. måned') ? value * websitePrice :
            label.includes('Vedligeholdelse pr. aftale') ? value * maintenanceDeals :
            label.includes('Antal vedligeholdelsesaftaler') ? value * maintenancePrice :
            label.includes('Hosting pr. kunde') ? value * hostingCustomers :
            label.includes('Antal hostingkunder') ? value * hostingPrice :
            label.includes('SEO pr. aftale') ? value * seoDeals :
            label.includes('Antal SEO aftaler') ? value * seoPrice :
            label.includes('Google Ads pr. aftale') ? value * googleAdsDeals :
            label.includes('Antal Google Ads aftaler') ? value * googleAdsPrice :
            label.includes('Konsulent pr. time') ? value :
            label.includes('Timer pr. kunde pr. måned') ? value * consultingHourlyRate :
            0
          )
        )
      )
    )
  );

  return React.createElement('div', { className: "max-w-4xl mx-auto p-6 bg-white" },

    React.createElement(InputSection, { title: "Grundlæggende økonomi", icon: "💰", bgColor: "bg-orange-50" },
      React.createElement(InputRow, { 
        label: "Ønsket månedlig løn", 
        value: monthlyWage, 
        onChange: setMonthlyWage,
        step: 1000
      }),
      React.createElement(InputRow, { 
        label: "Andre lønomkostninger (%)", 
        value: otherExpensesPercent, 
        onChange: setOtherExpensesPercent,
        suffix: "%"
      }),
      React.createElement(InputRow, { 
        label: "Ønsket profit (%)", 
        value: desiredProfitPercent, 
        onChange: setDesiredProfitPercent,
        suffix: "%"
      })
    ),

    React.createElement(InputSection, { title: "Nye hjemmesider", icon: "🏠", bgColor: "bg-blue-50" },
      React.createElement(InputRow, { 
        label: "Pris pr. hjemmeside", 
        value: websitePrice, 
        onChange: setWebsitePrice,
        step: 1000
      }),
      React.createElement(InputRow, { 
        label: "Antal pr. måned", 
        value: websitesPerMonth, 
        onChange: setWebsitesPerMonth,
        step: 0.5
      })
    ),

    React.createElement(InputSection, { title: "Vedligeholdelse & Hosting", icon: "🔧", bgColor: "bg-gray-50" },
      React.createElement(InputRow, { 
        label: "Vedligeholdelse pr. aftale", 
        value: maintenancePrice, 
        onChange: setMaintenancePrice,
        step: 100
      }),
      React.createElement(InputRow, { 
        label: "Antal vedligeholdelsesaftaler pr. måned", 
        value: maintenanceDeals, 
        onChange: setMaintenanceDeals,
        step: 0.5
      }),
      React.createElement(InputRow, { 
        label: "Hosting pr. kunde", 
        value: hostingPrice, 
        onChange: setHostingPrice,
        step: 50
      }),
      React.createElement(InputRow, { 
        label: "Antal hostingkunder pr. måned", 
        value: hostingCustomers, 
        onChange: setHostingCustomers,
        step: 0.5
      })
    ),

    React.createElement(InputSection, { title: "Marketing", icon: "📈", bgColor: "bg-purple-50" },
      React.createElement(InputRow, { 
        label: "SEO pr. aftale", 
        value: seoPrice, 
        onChange: setSeoPrice,
        step: 500
      }),
      React.createElement(InputRow, { 
        label: "Antal SEO aftaler pr. måned", 
        value: seoDeals, 
        onChange: setSeoDeals,
        step: 0.5
      }),
      React.createElement(InputRow, { 
        label: "Google Ads pr. aftale", 
        value: googleAdsPrice, 
        onChange: setGoogleAdsPrice,
        step: 500
      }),
      React.createElement(InputRow, { 
        label: "Antal Google Ads aftaler pr. måned", 
        value: googleAdsDeals, 
        onChange: setGoogleAdsDeals,
        step: 0.5
      })
    ),

    React.createElement(InputSection, { title: "Konsulentydelser", icon: "💼", bgColor: "bg-red-50" },
      React.createElement(InputRow, { 
        label: "Konsulent pr. time", 
        value: consultingHourlyRate, 
        onChange: setConsultingHourlyRate,
        step: 100
      }),
      React.createElement(InputRow, { 
        label: "Timer pr. kunde pr. måned", 
        value: consultingHoursPerMonth, 
        onChange: setConsultingHoursPerMonth,
        step: 0.5
      })
    ),

    // Resultat
    React.createElement('div', { className: "mt-8" },
      React.createElement('h2', { className: "text-xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2" },
        "Resultat"
      ),
      
      React.createElement('div', { className: "bg-blue-600 text-white rounded-lg p-6 text-center mb-6" },
        React.createElement('h3', { className: "text-lg font-medium mb-2" }, "Samlet månedlig omsætning"),
        React.createElement('div', { className: "text-3xl font-bold" }, formatCurrency(results.totalRevenue)),
        React.createElement('p', { className: "text-sm mt-2" }, "Nødvendig for at opfylde løn + profit mål")
      ),

      React.createElement('div', { className: "bg-green-50 border border-green-200 rounded-lg p-4" },
        React.createElement('h4', { className: "font-semibold mb-3 text-gray-800 flex items-center" },
          "📊 Omsætningsfordeling"
        ),
        React.createElement('div', { className: "space-y-2" },
          React.createElement('div', { className: "flex justify-between items-center" },
            React.createElement('span', {}, "Nye hjemmesider"),
            React.createElement('div', { className: "flex items-center" },
              React.createElement('span', { className: "text-green-600 font-medium mr-2" }, results.percentages?.websites + "%"),
              React.createElement('span', { className: "font-medium" }, formatCurrency(results.websiteRevenue))
            )
          ),
          React.createElement('div', { className: "flex justify-between items-center" },
            React.createElement('span', {}, "Konsulentydelser"),
            React.createElement('div', { className: "flex items-center" },
              React.createElement('span', { className: "text-green-600 font-medium mr-2" }, results.percentages?.consulting + "%"),
              React.createElement('span', { className: "font-medium" }, formatCurrency(results.consultingRevenue))
            )
          ),
          React.createElement('div', { className: "flex justify-between items-center" },
            React.createElement('span', {}, "Vedligeholdelse"),
            React.createElement('div', { className: "flex items-center" },
              React.createElement('span', { className: "text-green-600 font-medium mr-2" }, results.percentages?.maintenance + "%"),
              React.createElement('span', { className: "font-medium" }, formatCurrency(results.maintenanceRevenue))
            )
          ),
          React.createElement('div', { className: "flex justify-between items-center" },
            React.createElement('span', {}, "SEO"),
            React.createElement('div', { className: "flex items-center" },
              React.createElement('span', { className: "text-green-600 font-medium mr-2" }, results.percentages?.seo + "%"),
              React.createElement('span', { className: "font-medium" }, formatCurrency(results.seoRevenue))
            )
          ),
          React.createElement('div', { className: "flex justify-between items-center" },
            React.createElement('span', {}, "Google Ads"),
            React.createElement('div', { className: "flex items-center" },
              React.createElement('span', { className: "text-green-600 font-medium mr-2" }, results.percentages?.googleAds + "%"),
              React.createElement('span', { className: "font-medium" }, formatCurrency(results.googleAdsRevenue))
            )
          ),
          React.createElement('div', { className: "flex justify-between items-center" },
            React.createElement('span', {}, "Hosting"),
            React.createElement('div', { className: "flex items-center" },
              React.createElement('span', { className: "text-green-600 font-medium mr-2" }, results.percentages?.hosting + "%"),
              React.createElement('span', { className: "font-medium" }, formatCurrency(results.hostingRevenue))
            )
          )
        )
      )
    ),

    // Vækstprojektion sektion (forenklet version uden chart)
    React.createElement('div', { className: "mt-8" },
      React.createElement('h2', { className: "text-xl font-bold mb-6 text-gray-800 border-b-2 border-blue-500 pb-2 flex items-center" },
        "📈 Vækstprojektion"
      ),
      React.createElement('div', { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" },
        React.createElement('h3', { className: "flex items-center text-lg font-semibold mb-4 text-gray-800" },
          "⏰ Indstillinger"
        ),
        React.createElement('div', { className: "space-y-3" },
          React.createElement('div', { className: "flex justify-between items-center" },
            React.createElement('label', { className: "text-gray-700" }, "Antal måneder at vise:"),
            React.createElement('input', {
              type: "number",
              value: projectionMonths,
              onChange: (e) => setProjectionMonths(parseInt(e.target.value) || 24),
              min: "12",
              max: "60",
              className: "w-20 px-3 py-2 border border-gray-300 rounded-md text-right"
            })
          ),
          React.createElement('div', { className: "flex justify-between items-center" },
            React.createElement('label', { className: "text-gray-700" }, "Churn (månedlig):"),
            React.createElement('div', { className: "flex items-center" },
              React.createElement('input', {
                type: "number",
                value: churnRate,
                onChange: (e) => setChurnRate(parseFloat(e.target.value) || 0),
                min: "0",
                max: "50",
                step: "0.5",
                className: "w-16 px-3 py-2 border border-gray-300 rounded-md text-right mr-1"
              }),
              React.createElement('span', { className: "text-gray-600" }, "%")
            )
          )
        )
      ),
      React.createElement('div', { className: "bg-white border border-gray-200 rounded-lg p-6" },
        React.createElement('h3', { className: "text-lg font-semibold mb-4 text-gray-800" },
          "Omsætningsprojektion med voksende abonnementsydelser"
        ),
        React.createElement('div', { className: "h-96" },
          React.createElement(Recharts.ResponsiveContainer, { width: "100%", height: "100%" },
            React.createElement(Recharts.LineChart, { data: projectionData },
              React.createElement(Recharts.CartesianGrid, { strokeDasharray: "3 3" }),
              React.createElement(Recharts.XAxis, { 
                dataKey: "month",
                angle: -45,
                textAnchor: "end",
                height: 80,
                interval: Math.floor(projectionMonths / 12)
              }),
              React.createElement(Recharts.YAxis, { 
                tickFormatter: (value) => `${Math.round(value / 1000)}k kr.`
              }),
              React.createElement(Recharts.Tooltip, { 
                formatter: (value, name) => [
                  formatCurrency(value), 
                  name === 'totalOmsaetning' ? 'Total Omsætning' :
                  name === 'noedvendigOmsaetning' ? 'Nødvendig Omsætning (Løn + Profit)' :
                  'Minimumskrav (Kun løn + omkostninger)'
                ],
                labelFormatter: (label, payload) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return React.createElement('div', {},
                      React.createElement('div', { className: "font-medium" }, label),
                      React.createElement('div', { className: "text-sm text-gray-600 mt-1" },
                        React.createElement('div', {}, `Vedligeholdelsesaftaler: ${data.vedligeholdelsesaftaler?.toFixed(1) || 0}`),
                        React.createElement('div', {}, `Hostingkunder: ${data.hostingkunder?.toFixed(1) || 0}`),
                        React.createElement('div', {}, `SEO aftaler: ${data.seoAftaler?.toFixed(1) || 0}`),
                        React.createElement('div', {}, `Google Ads aftaler: ${data.googleAdsAftaler?.toFixed(1) || 0}`),
                        React.createElement('div', {}, `Konsulenttimer: ${data.konsulentTimer?.toFixed(1) || 0}`)
                      )
                    );
                  }
                  return label;
                }
              }),
              React.createElement(Recharts.Legend, { 
                formatter: (value) => 
                  value === 'totalOmsaetning' ? 'Total Omsætning' :
                  value === 'noedvendigOmsaetning' ? 'Nødvendig Omsætning (Løn + Profit)' :
                  'Minimumskrav (Kun løn + omkostninger)'
              }),
              React.createElement(Recharts.Line, { 
                type: "monotone",
                dataKey: "totalOmsaetning",
                stroke: "#2563eb",
                strokeWidth: 3,
                dot: { fill: '#2563eb', strokeWidth: 2, r: 4 }
              }),
              React.createElement(Recharts.Line, { 
                type: "monotone",
                dataKey: "noedvendigOmsaetning",
                stroke: "#dc2626",
                strokeWidth: 2,
                strokeDasharray: "5 5",
                dot: { fill: '#dc2626', strokeWidth: 2, r: 3 }
              }),
              React.createElement(Recharts.Line, { 
                type: "monotone",
                dataKey: "minimumskrav",
                stroke: "#f59e0b",
                strokeWidth: 2,
                strokeDasharray: "10 5",
                dot: { fill: '#f59e0b', strokeWidth: 2, r: 3 }
              })
            )
          )
        )
      )
    )
  );
};

// Render komponenten når siden er loaded
document.addEventListener('DOMContentLoaded', function() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(Calculator));
});
