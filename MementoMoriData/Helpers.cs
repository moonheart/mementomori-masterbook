using MessagePack;
using Newtonsoft.Json;

namespace MementoMoriData;

public static class Helpers
{
    private static readonly HttpClient UnityHttpClient;
    private static readonly HttpClient OrtegaHttpClient;

    static Helpers()
    {
        UnityHttpClient = new HttpClient();
        UnityHttpClient.Timeout = TimeSpan.FromSeconds(10);
        UnityHttpClient.DefaultRequestHeaders.Add("User-Agent", "UnityPlayer/2021.3.10f1 (UnityWebRequest/1.0, libcurl/7.80.0-DEV)");
        UnityHttpClient.DefaultRequestHeaders.Add("X-Unity-Version", "2021.3.10f1");

        OrtegaHttpClient = new HttpClient();
        OrtegaHttpClient.Timeout = TimeSpan.FromSeconds(10);
        OrtegaHttpClient.DefaultRequestHeaders.Add("ortegaaccesstoken", "");
        OrtegaHttpClient.DefaultRequestHeaders.Add("ortegaappversion", "1.3.7"); // this must be set manually, maybe get from google play store?
        OrtegaHttpClient.DefaultRequestHeaders.Add("ortegadevicetype", "2");
        OrtegaHttpClient.DefaultRequestHeaders.Add("accept-encoding", "gzip");
        OrtegaHttpClient.DefaultRequestHeaders.Add("ortegauuid", "f6b22199a6964bd3813ef4032969e0c2"); // random guid
        OrtegaHttpClient.DefaultRequestHeaders.Add("user-agent", "BestHTTP/2 v2.3.0");
    }

    public static async Task DownloadMasterCatalog()
    {
        var masterVersion = await GetMasterVersion();
        Log($"Got master version: {masterVersion}.");
        if (string.IsNullOrEmpty(masterVersion))
        {
            Log("Failed to get master version, exit.");
            return;
        }

        var url = $"https://cdn-mememori.akamaized.net/master/prd1/version/{masterVersion}/master-catalog";
        Log($"Downloading master catalog from {url}...");
        var bytes = await UnityHttpClient.GetByteArrayAsync(url);
        Log($"Download master catalog success.");
        
        var masterBookCatalog = MessagePackSerializer.Deserialize<MasterBookCatalog>(bytes);
        Directory.CreateDirectory("./Master");
        foreach (var (name, _) in masterBookCatalog.MasterBookInfoMap)
        {
            var localPath = $"./Master/{name}.json";
            var mbUrl = $"https://cdn-mememori.akamaized.net/master/prd1/version/{masterVersion}/{name}";
            Log($"Downloading master book {name} from {mbUrl}...");
            var fileBytes = await UnityHttpClient.GetByteArrayAsync(mbUrl);
            Log($"Download master book {name} success.");
            var dictionary = MessagePackSerializer.Deserialize<object>(fileBytes);
            await File.WriteAllTextAsync(localPath, JsonConvert.SerializeObject(dictionary, Formatting.Indented));
            Log($"Saved master book {name} to {localPath}.");
        }
        Log("Done.");
    }

    private static void Log(string s)
    {
        Console.WriteLine($"{DateTimeOffset.Now} {s}");
    }

    private static async Task<string> GetMasterVersion()
    {
        var request = new HttpRequestMessage
        {
            Method = HttpMethod.Post,
            Content = new ByteArrayContent(MessagePackSerializer.Serialize(new GetDataUriRequest())),
            RequestUri = new Uri("https://prd1-auth.mememori-boi.com/api/auth/getDataUri")
        };

        var response = await OrtegaHttpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        return response.Headers.TryGetValues("ortegamasterversion", out var values) ? values.FirstOrDefault() ?? "" : "";
    }

    [MessagePackObject(true)]
    public class GetDataUriRequest
    {
        public string CountryCode { get; set; } = "JP";

        public long UserId { get; set; }
    }

    [MessagePackObject(true)]
    public class MasterBookCatalog
    {
        public Dictionary<string, object> MasterBookInfoMap { get; set; }
    }
}