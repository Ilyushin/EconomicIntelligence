#Economic Intelligence

The project focused on the use of public data to assess the economic situation in the country based on the state of the stock market and national means of payment, in particular - of the national currency.

##As sources are used:

- Open data Ministry of Finance of the Russian Federation
- These Moscow Exchange
- Google Finance Data

##Technologies used:

###Backend:
- Databases (relational) - Microsoft SQL Server 2014
- Databases (multivariate) models DataMining, OLAP-cube - Microsoft Analysis Services 12.0
- Web-server - Windows Server 2012 / Internet Information Services
- ASP.NET HTTP Restful API and Frontend ETL (загрузка и пре-процессинг данных, управление обновлением данных)
- SQL Server Integration Services 2014 (developing in Visual Studio 2013, SSDT)

###Frontend:
 - AngularJS
 - ChartJS
 - Twitter Bootstrap
 - 
These were chosen so that the detail (granularity) in the set is not less than 1 day. The result has been created and filled with data analytic repository (Kimball model, topology - star), which was used to build a multi-dimensional databases and OLAP-based cubes on it, as well as models of analysis of data on two main algorithms: Microsoft Time Series, Microsoft Neural Network.

To ensure interoperability frontend and backend server for backend-server was set up HTTP-Restful interface JSON-issuing documents in the form of finished sets.

##The project includes two main areas:
 - Intelligent visualization of open data
 - Analysis of open data and the construction of forecasts based on them

Intelligent visualization involves the use of MDX-queries to the OLAP-cube, followed by depression (drilldown) in the data, the system allows the user to quickly find the "weak points" of the economy, as part of the data collected.

To predict the time a standard mix of algorithms ARTXP / ARIMA, without the use of queries involving cross-prediction (but it is possible to enroll in the system correct data). These algorithms have been tested primarily on foreign exchange rates (US dollar) and the assets of banks included in the special list of Ministry of Finance. In addition, for assets shows the different customization options algorithms - a long-term, short-term and medium-term (balanced) plan.

Assessing the impact of oil prices and foreign currency exchange rate for the total market capitalization was conducted on a sample of the data collected: companies with a total market capitalization of 100 to 500 million rubles, present in the market during 2013-2015 Analytical server builds the neural network receiving the input exchange rates, companies, the weighted average share price, total capitalization of the company and the price of oil to requests received models give the opportunity to evaluate the growth rate of \ fall (if at all) the company's capitalization at historical exchange rates and/or the cost of oil.

Built a system can expand to include new indicators, which will significantly increase the accuracy of forecasting.
