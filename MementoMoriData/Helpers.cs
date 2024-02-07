using System.Text;
using MessagePack;
using Newtonsoft.Json;
// using QQChannelFramework.Api;
using Telegram.Bot;

namespace MementoMoriData;

public static class Helpers
{
    private static readonly HttpClient UnityHttpClient;
    private static string MasterUriFormat;
    private static readonly string? AuthUri = Environment.GetEnvironmentVariable("AUTH_URI");
    static HttpClient httpClient = new();

    static Helpers()
    {
        UnityHttpClient = new HttpClient();
        UnityHttpClient.Timeout = TimeSpan.FromSeconds(10);
        UnityHttpClient.DefaultRequestHeaders.Add("User-Agent", "UnityPlayer/2021.3.10f1 (UnityWebRequest/1.0, libcurl/7.80.0-DEV)");
        UnityHttpClient.DefaultRequestHeaders.Add("X-Unity-Version", "2021.3.10f1");

        httpClient.Timeout = TimeSpan.FromSeconds(10);
        httpClient.DefaultRequestHeaders.Add("ortegaaccesstoken", "");
        httpClient.DefaultRequestHeaders.Add("ortegadevicetype", "2");
        httpClient.DefaultRequestHeaders.Add("accept-encoding", "gzip");
        httpClient.DefaultRequestHeaders.Add("ortegauuid", "f6b22199a6964bd3813ef4032969e0c2"); // random guid
        httpClient.DefaultRequestHeaders.Add("user-agent", "BestHTTP/2 v2.3.0");
    }

    public static async Task DownloadMasterCatalog()
    {
        Directory.CreateDirectory("./Master");

        var lastVersion = string.Empty;
        try
        {
            lastVersion = await File.ReadAllTextAsync("./Master/version");
        }
        catch
        {
            // ignored
        }

        var masterVersion = await GetMasterVersion();
        Log($"Got master version: {masterVersion}.");
        if (string.IsNullOrEmpty(masterVersion))
        {
            Log("Failed to get master version, exit.");
            return;
        }

        if (!string.IsNullOrEmpty(lastVersion) && lastVersion == masterVersion)
        {
            Log("Master version is the same as last time, exit.");
            return;
        }

        var url = string.Format(MasterUriFormat, masterVersion, "master-catalog");
        Log($"Downloading master catalog from {url}...");
        var bytes = await UnityHttpClient.GetByteArrayAsync(url);
        Log($"Download master catalog success.");

        var masterBookCatalog = MessagePackSerializer.Deserialize<MasterBookCatalog>(bytes);
        await File.WriteAllTextAsync("./Master/master-catalog.json", JsonConvert.SerializeObject(masterBookCatalog, Formatting.Indented));
        Log($"Saved master catalog to ./Master/master-catalog.json.");

        var sb = new StringBuilder();
        sb.AppendLine($"# Data List");
        sb.AppendLine($"Master Version {masterVersion}({DateTimeOffset.FromUnixTimeMilliseconds(long.Parse(masterVersion))})\n");
        sb.AppendLine("|Name|Size|Hash|Parsed Json|");
        sb.AppendLine("|-|-|-|-|");

        foreach (var (name, info) in masterBookCatalog.MasterBookInfoMap)
        {
            var localPath = $"./Master/{name}.json";
            var localMd5 = $"./Master/{name}.md5";
            var mbUrl = string.Format(MasterUriFormat, masterVersion, name);

            sb.AppendLine($"|[{name}]({mbUrl}) | {info.Size} | {info.Hash} | [{name}.json]({name}.json)|");

            Log($"Verifying master book {name}...");
            if (File.Exists(localMd5) && await File.ReadAllTextAsync(localMd5) == info.Hash)
            {
                Log($"Skipping master book {name} because it is already downloaded.");
                continue;
            }

            Log($"Downloading master book {name} from {mbUrl}...");
            var fileBytes = await UnityHttpClient.GetByteArrayAsync(mbUrl);
            Log($"Download master book {name} success.");

            var dictionary = MessagePackSerializer.Deserialize<object>(fileBytes);
            await File.WriteAllTextAsync(localPath, JsonConvert.SerializeObject(dictionary, Formatting.Indented));
            Log($"Saved master book {name} to {localPath}.");

            await File.WriteAllTextAsync(localMd5, info.Hash);
            Log($"Saved master book {name} md5 to {localMd5}.");
        }

        await File.WriteAllTextAsync("./Master/readme.md", sb.ToString());
        await File.WriteAllTextAsync("./Master/version", masterVersion);

        var message = $"主数据有更新, 更新时间 {DateTimeOffset.FromUnixTimeMilliseconds(long.Parse(masterVersion))}, 在这里查看 https://github.com/moonheart/mementomori-masterbook/blob/master/Master/readme.md";
        await SendNotification(message);

        Log("Done.");
    }

    private static void Log(string s)
    {
        Console.WriteLine($"{DateTimeOffset.Now} {s}");
    }

    private static async Task<string> GetMasterVersion()
    {
        if (string.IsNullOrEmpty(AuthUri))
        {
            throw new Exception("AUTH_URI is not set.");
        }

        var appVersion = "2.6.0";
        if (File.Exists("./appversion")) appVersion = File.ReadAllText("./appversion");
        appVersion = await GetLatestAvailableVersion(appVersion);
        File.WriteAllText("./appversion", appVersion);

        using var response = await GetDataUriReq(appVersion);
        response.EnsureSuccessStatusCode();
        var dict = MessagePackSerializer.Deserialize<Dictionary<string, Object>>(await response.Content.ReadAsStreamAsync());
        MasterUriFormat = dict["MasterUriFormat"].ToString();
        return response.Headers.TryGetValues("ortegamasterversion", out var values) ? values.FirstOrDefault() ?? "" : "";
    }

    private static async Task<HttpResponseMessage> GetDataUriReq(string appVersion)
    {
        var request = new HttpRequestMessage
        {
            Method = HttpMethod.Post,
            Content = new ByteArrayContent(MessagePackSerializer.Serialize(new GetDataUriRequest())),
            RequestUri = new Uri($"{AuthUri}/api/auth/getDataUri"),
            Headers = {{"ortegaappversion", appVersion}}
        };

        return await httpClient.SendAsync(request);
    }

    private async static Task<string> GetLatestAvailableVersion(string currentVersion)
    {
        Log("auto get latest version...");
        var buildAddCount = 5;
        var minorAddCount = 5;
        var majorAddCount = 5;


        while (true)
        {
            using var respMsg = await GetDataUriReq(currentVersion);
            if (!respMsg.IsSuccessStatusCode) throw new InvalidOperationException(respMsg.ToString());

            await using var stream = await respMsg.Content.ReadAsStreamAsync();
            if (respMsg.Headers.TryGetValues("ortegastatuscode", out var headers2))
            {
                var ortegastatuscode = headers2.FirstOrDefault() ?? "";
                if (ortegastatuscode != "0")
                {
                    var apiErrResponse = MessagePackSerializer.Deserialize<ApiErrorResponse>(stream);

                    // CommonRequireClientUpdate = 103,
                    if (apiErrResponse.ErrorCode != 103)
                    {
                        throw new InvalidOperationException($"ortegastatuscode: {ortegastatuscode}, {apiErrResponse.Message}");
                    }

                    var version = new Version(currentVersion);
                    if (buildAddCount > 0)
                    {
                        var newVersion = new Version(version.Major, version.Minor, version.Build + 1);
                        currentVersion = newVersion.ToString(3);
                        Log($"trying {currentVersion}");
                        buildAddCount--;
                        continue;
                    }

                    if (minorAddCount > 0)
                    {
                        var newVersion = new Version(version.Major, version.Minor + 1, 0);
                        currentVersion = newVersion.ToString(3);
                        Log($"trying {currentVersion}");
                        minorAddCount--;
                        buildAddCount = 5;
                        continue;
                    }

                    if (majorAddCount > 0)
                    {
                        var newVersion = new Version(version.Major + 1, 0, 0);
                        currentVersion = newVersion.ToString(3);
                        Log($"trying {currentVersion}");
                        majorAddCount--;
                        buildAddCount = 5;
                        minorAddCount = 5;
                        continue;
                    }

                    throw new InvalidOperationException("reached max try out");
                }

                Log($"found latest version {currentVersion}");
                File.WriteAllText("./appversion", currentVersion);
                return currentVersion;
            }

            throw new InvalidOperationException("no ortegastatuscode");
        }
    }


    private static async Task SendNotification(string message)
    {
        var token = Environment.GetEnvironmentVariable("TELEGRAM_BOT_TOKEN");
        var chatId = Environment.GetEnvironmentVariable("TELEGRAM_CHAT_ID");

        if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(chatId))
        {
            return;
        }

        TelegramBotClient botClient = new(token);
        await botClient.SendTextMessageAsync(chatId, message);
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
        public Dictionary<string, MasterBookInfo> MasterBookInfoMap { get; set; }
    }

    [MessagePackObject(true)]
    public class MasterBookInfo
    {
        public string Hash { get; set; }

        public string Name { get; set; }

        public int Size { get; set; }
    }

    [MessagePackObject(true)]
    public class ApiErrorResponse
    {
        public int ErrorCode { get; set; }

        public string Message { get; set; }

        [Obsolete("ErrorCodeに移行します")]
        public int ErrorHandlingType { get; set; }

        [Obsolete("ErrorCodeに移行します")]
        public long ErrorMessageId { get; set; }

        [Obsolete("ErrorCodeに移行します")]
        public string[] MessageParams { get; set; }
    }
}
