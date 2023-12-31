﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using AgilityPackHtmlDocument = HtmlAgilityPack.HtmlDocument;



namespace telegramExportReader
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            processingProgress.Visible = false;
            buttonsPanel.Visible = true;

            Version currentVersion = new Version(Application.ProductVersion);
            if (CheckForUpdate())
            {
                DialogResult dialogResult = MessageBox.Show("A new version is available. Do you want to download it?", "Update Available", MessageBoxButtons.YesNo);

                if (dialogResult == DialogResult.Yes)
                {
                    openLink("https://github.com/EmerickGrimm/Telegram-Chat-Export-Reader/releases");
                }
                else
                {
                    
                }
            }

            // To Fix: Can't load image from resources.
            //pictureBox1.Image = Properties.Resources.appIco_PNG;

        }

        private async void button1_Click(object sender, EventArgs e)
        {
            using (var folderDialog = new FolderBrowserDialog())
            {
                if (folderDialog.ShowDialog() == DialogResult.OK)
                {
                    string selectedFolderPath = folderDialog.SelectedPath;
                    string[] htmlFiles = Directory.GetFiles(selectedFolderPath, "messages*.html");

                    if (htmlFiles.Length > 0)
                    {
                        progressBar1.Maximum = htmlFiles.Length;
                        progressBar1.Value = 0;

                        processingProgress.Visible = true;
                        buttonsPanel.Visible = false;
                        await ProcessHtmlFiles(htmlFiles, selectedFolderPath);
                        openChat();
                        //    MessageBox.Show("Processing complete.", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    }
                    else
                    {
                        MessageBox.Show("No HTML files found in the selected folder.", "Files Not Found", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                        return;
                    }
                }
            }
        }

        private async Task ProcessHtmlFiles(string[] htmlFiles, string baseFolderPath)
        {
            progressBar1.Maximum = htmlFiles.Length;
            progressBar1.Value = 0;

            List<ChatMessage> chatMessages = new List<ChatMessage>();
            string previousAuthor = null;

            for (int i = 0; i < htmlFiles.Length; i++)
            {
                string filePath = htmlFiles[i];
                progressBar1.Value = i + 1;

                AgilityPackHtmlDocument doc = new AgilityPackHtmlDocument();
                doc.Load(filePath, Encoding.UTF8);

                var messageNodes = doc.DocumentNode.SelectNodes("//div[contains(@class, 'message')]");

                if (messageNodes != null)
                {
                    foreach (var messageNode in messageNodes)
                    {
                        string author = messageNode.SelectSingleNode(".//div[contains(@class, 'from_name')]")?.InnerText.Trim();
                        string date = messageNode.SelectSingleNode(".//div[contains(@class, 'date')]")?.GetAttributeValue("title", "");
                        ChatMessage.MessageType messageType;

                        if (string.IsNullOrWhiteSpace(author) && previousAuthor != null)
                        {
                            author = previousAuthor;
                        }

                        string messageText = null;
                        string stickerSrc = messageNode.SelectSingleNode(".//img[contains(@class, 'sticker')]")?.GetAttributeValue("src", "");
                        if (!string.IsNullOrEmpty(stickerSrc))
                        {
                            messageType = ChatMessage.MessageType.Sticker;
                            messageText = Path.Combine(baseFolderPath, stickerSrc);
                        }
                        else
                        {
                            messageType = ChatMessage.MessageType.Text;
                            messageText = messageNode.SelectSingleNode(".//div[contains(@class, 'text')]")?.InnerText.Trim();
                        }

                        if (!string.IsNullOrWhiteSpace(author) && !string.IsNullOrWhiteSpace(messageText))
                        {
                            ChatMessage chatMessage = new ChatMessage
                            {
                                Author = author,
                                MessageText = messageText,
                                Date = date,
                                Type = messageType
                            };

                            chatMessages.Add(chatMessage);
                            previousAuthor = author;
                        }
                    }
                }
            }

            try
            {
                // Sorting by date
                chatMessages = chatMessages.OrderBy(message => DateTime.ParseExact(message.Date, "dd.MM.yyyy HH:mm:ss 'UTC'zzz", System.Globalization.CultureInfo.InvariantCulture)).ToList();

                // Создание JSON из отсортированного списка chatMessages
                string json = JsonConvert.SerializeObject(chatMessages, Formatting.Indented);
                File.WriteAllText("chat_messages.json", json, Encoding.UTF8);

                // MessageBox.Show("JSON file was successfully created.", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }


        public class ChatMessage
        {
            public string Author { get; set; }
            public string MessageText { get; set; }
            public string Date { get; set; }
            public MessageType Type { get; set; }

            public enum MessageType
            {
                Text,
                Sticker
            }
        }

        private async void loadLastFile_Click_1(object sender, EventArgs e)
        {
            openChat();
        }

        private void openChat()
        {
            this.Hide();

            Main mainForm = new Main();
            mainForm.Show();
        }

        private void linkLabel1_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            About aboutWindow = new About();
            aboutWindow.Show();
        }
        private bool CheckForUpdate()
        {
            try
            {
                string latestReleaseUrl = "https://api.github.com/repos/EmerickGrimm/Telegram-Chat-Export-Reader/releases/latest";
                WebClient client = new WebClient();
                client.Headers.Add("User-Agent", "telegramExportReaderClient"); // GitHub API требует User-Agent заголовок

                string response = client.DownloadString(latestReleaseUrl);
                dynamic releaseInfo = JsonConvert.DeserializeObject(response);

                string latestVersion = releaseInfo.tag_name;
                Version currentVersion = new Version(Application.ProductVersion);

                if (Version.TryParse(latestVersion, out Version newVersion))
                {
                    if (newVersion > currentVersion)
                    {
                        return true; // Есть новая версия
                    }
                }
            }
            catch (Exception ex)
            {
                // Обработка ошибки
            }

            return false;
        }
        private void pictureBox1_Click(object sender, EventArgs e)
        {

        }

        private void openLink(string target)
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = target,
                UseShellExecute = true
            });
        }
    }
}