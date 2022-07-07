using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace weatherGlobeApi
{
    /// <summary>
    /// Summary description for WeatherGlobeApi
    /// </summary>
    public class WeatherGlobeApi : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.AddHeader("Access-Control-Allow-Origin", "*");
            string param = context.Request.QueryString["method"];
            string cityName = context.Request.QueryString["name"];
            switch (param.ToString().ToLower())
            {
                case "getweatherbycity":
                    context.Response.Write(GetWeatherBycity(cityName));
                    break;
                default:
                    context.Response.Write("error");
                    break;
            }
        }

        public dynamic GetWeatherBycity(string cityName)
        {
            var apikey = "e00749a0da77a25b4785acbc639ea958";
            string apiLink = $"https://api.openweathermap.org/data/2.5/weather?q={cityName}&appid={apikey}&units=metric";
            WebRequest reqObj = WebRequest.Create(apiLink);
            reqObj.Method = "GET";
            string strResponseValue = null;

            try
            {
                using (HttpWebResponse response = (HttpWebResponse)reqObj.GetResponse())
                {
                    if (response.StatusCode != HttpStatusCode.OK)
                    {
                        throw new Exception("error code:" + response.StatusCode.ToString());
                    }

                    using (Stream responseStream = response.GetResponseStream())
                    {
                        if (responseStream != null)
                        {
                            using (StreamReader reader = new StreamReader(responseStream))
                            {
                                strResponseValue = reader.ReadToEnd();
                            }
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                using (var stream = ex.Response.GetResponseStream())
                using (var reader = new StreamReader(stream))
                {
                    Console.WriteLine(reader.ReadToEnd());
                }
            }

            //HttpWebResponse resObjGet = (HttpWebResponse)reqObj.GetResponse();
            //string strres = null;
            //using (Stream stream = resObjGet.GetResponseStream())
            //{
            //    StreamReader sr = new StreamReader(stream);
            //    strres = sr.ReadToEnd();
            //    sr.Close();
            //}
            //return JObject.Parse(strres);
            if (strResponseValue != null)
            {
                return JObject.Parse(strResponseValue);
            }
            else { 
                return "No City Found";
            }

        }


        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}