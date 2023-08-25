using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static telegramExportReader.Form1;

namespace telegramExportReader
{
    public partial class Main : Form
    {
        private List<ChatMessage> chatMessages;
        private int currentMessageIndex = 0;
        private bool inSearchMode, isLoadingMessages = false;
        private List<Panel> addedPanels = new List<Panel>();
        private List<ChatMessage> displayedMessages = new List<ChatMessage>();



        public Main()
        {
            InitializeComponent();
            Load += Main_Load;

        }

        private async void Main_Load(object sender, EventArgs e)
        {
            mainPanel.AutoScroll = true;
            mainPanel.VerticalScroll.Value = mainPanel.VerticalScroll.Maximum;
            mainPanel.MouseWheel += MainPanel_MouseWheel;
            await LoadInitialMessagesAsync();


            textBox1.KeyDown += textBox1_KeyDown;
        }


        private async Task LoadInitialMessagesAsync()
        {
            if (File.Exists("chat_messages.json"))
            {
                string json = File.ReadAllText("chat_messages.json", Encoding.UTF8);
                chatMessages = JsonConvert.DeserializeObject<List<ChatMessage>>(json);

                int endIndex = Math.Min(10, chatMessages.Count); // Load the first 10 messages
                List<ChatMessage> initialMessages = new List<ChatMessage>();

                for (int i = 0; i < endIndex; i++)
                {
                    initialMessages.Add(chatMessages[i]);
                    currentMessageIndex++;
                }

                AddMessagesToPanel(initialMessages);
            }
            else
            {
                MessageBox.Show("No chat file found.", "File Not Found", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        private async void MainPanel_MouseWheel(object sender, MouseEventArgs e)
        {

            int scrollThreshold = 100;

            // Checking that we hit treshold and msgs are not loading
            if (mainPanel.VerticalScroll.Value + mainPanel.Height >= mainPanel.VerticalScroll.Maximum - scrollThreshold && !isLoadingMessages && !inSearchMode)
            {
                isLoadingMessages = true;
                await LoadMessagesAsync();
                isLoadingMessages = false;
            }
        }
        private async Task LoadMessagesAsync()
        {
            if (chatMessages != null && currentMessageIndex < chatMessages.Count)
            {
                mainPanel.SuspendLayout();

                int startIndex = currentMessageIndex;
                int endIndex = Math.Min(currentMessageIndex + 10, chatMessages.Count);
                List<ChatMessage> newMessages = new List<ChatMessage>();

                for (int i = startIndex; i < endIndex; i++)
                {
                    newMessages.Add(chatMessages[i]);
                    currentMessageIndex++;
                }

                AddMessagesToPanel(newMessages);

                mainPanel.ResumeLayout();
            }
        }

        private void AddMessagesToPanel(List<ChatMessage> messages)
        {
            foreach (var message in messages)
            {
                Panel messagePanel = CreateMessagePanel();
                PopulateMessageLabels(messagePanel, message);

                addedPanels.Insert(0, messagePanel); // Insert at the beginning of the list
            }

            mainPanel.Controls.Clear();


            foreach (var messagePanel in addedPanels)
            {
                mainPanel.Controls.Add(messagePanel);
            }
        }

        private Panel CreateMessagePanel()
        {
            Panel messagePanel = new Panel();
            messagePanel.BorderStyle = BorderStyle.None;
            messagePanel.Margin = new Padding(5, 5, 5, 0);
            messagePanel.Dock = DockStyle.Top;
            messagePanel.Padding = new Padding(0, 0, 10, 0);
            return messagePanel;
        }

        private void PopulateMessageLabels(Panel messagePanel, ChatMessage message)
        {
            Label authorLabelCopy = new Label();
            authorLabelCopy.Text = message.Author;
            authorLabelCopy.AutoSize = true;
            authorLabelCopy.Font = authorLabel.Font;
            authorLabelCopy.ForeColor = authorLabel.ForeColor;
            authorLabelCopy.Location = new Point(10, 10);

            if (message.Type == ChatMessage.MessageType.Text) // Текстовое сообщение
            {
                Label messageTextCopy = new Label();
                messageTextCopy.Text = message.MessageText;
                messageTextCopy.AutoSize = true;
                messageTextCopy.Font = messageText.Font;
                messageTextCopy.ForeColor = messageText.ForeColor;
                messageTextCopy.Location = new Point(10, authorLabelCopy.Bottom + 10);
                messageTextCopy.MaximumSize = new Size(650, 0);

                Label messageDateCopy = new Label();
                messageDateCopy.Text = message.Date;
                messageDateCopy.AutoSize = true;
                messageDateCopy.Font = messageDate.Font;
                messageDateCopy.ForeColor = messageDate.ForeColor;
                messageDateCopy.Anchor = AnchorStyles.Top | AnchorStyles.Right;
                messageDateCopy.TextAlign = ContentAlignment.TopRight;

                int verticalSpacing = 14;
                messageTextCopy.Margin = new Padding(0, 0, 0, verticalSpacing);
                messageDateCopy.Margin = new Padding(0, verticalSpacing, 0, 0);

                messagePanel.Controls.Add(authorLabelCopy);
                messagePanel.Controls.Add(messageTextCopy);
                messagePanel.Controls.Add(messageDateCopy);
            }
            else if (message.Type == ChatMessage.MessageType.Sticker) // Сообщение с изображением (стикером)
            {
                PictureBox imageBox = new PictureBox();
                imageBox.SizeMode = PictureBoxSizeMode.StretchImage; // Устанавливаем режим масштабирования

                // Загружаем изображение по указанному пути
                Image stickerImage = Image.FromFile(message.MessageText);

                Image resizedImage = ResizeImage(stickerImage, 100, 100);
                imageBox.Image = resizedImage;

                imageBox.Location = new Point(10, authorLabelCopy.Bottom + 10);

                Label messageDateCopy = new Label();
                messageDateCopy.Text = message.Date;
                messageDateCopy.AutoSize = true;
                messageDateCopy.Font = messageDate.Font;
                messageDateCopy.ForeColor = messageDate.ForeColor;
                messageDateCopy.Anchor = AnchorStyles.Top | AnchorStyles.Right;
                messageDateCopy.TextAlign = ContentAlignment.TopRight;

                int verticalSpacing = 14;
                imageBox.Margin = new Padding(0, 0, 0, verticalSpacing);
                messageDateCopy.Margin = new Padding(0, verticalSpacing, 0, 0);

                messagePanel.Controls.Add(authorLabelCopy);
                messagePanel.Controls.Add(imageBox);
                messagePanel.Controls.Add(messageDateCopy);
            }
        }

        private Image ResizeImage(Image sourceImage, int width, int height)
        {
            Bitmap resizedImage = new Bitmap(width, height);
            using (Graphics graphics = Graphics.FromImage(resizedImage))
            {
                graphics.DrawImage(sourceImage, 0, 0, width, height);
            }
            return resizedImage;
        }



        private void profilePicture_Click(object sender, EventArgs e)
        {

        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }

        private void textBox1_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                PerformSearch();
            }
        }


        private async void PerformSearch()
        {
            string searchText = textBox1.Text.Trim();

            if (searchText.Length == 0)
            {
                RefreshDisplayedMessages();
                LoadInitialMessagesAsync();
                inSearchMode = false;
                return;
            }

            using (var progressForm = new Form())
            {
                progressForm.StartPosition = FormStartPosition.CenterScreen;
                progressForm.Size = new Size(300, 100);
                progressForm.FormBorderStyle = FormBorderStyle.FixedDialog;
                progressForm.MaximizeBox = false;
                progressForm.MinimizeBox = false;
                progressForm.Text = "Searching...";

                Label label = new Label();
                label.Text = "Searching for messages...";
                label.Location = new Point(10, 10);
                label.AutoSize = true;
                progressForm.Controls.Add(label);

                ProgressBar progressBar = new ProgressBar();
                progressBar.Minimum = 0;
                progressBar.Maximum = chatMessages.Count;
                progressBar.Value = 0;
                progressBar.Location = new Point(10, 30);
                progressBar.Size = new Size(progressForm.Width - 30, 20);
                progressForm.Controls.Add(progressBar);

                progressForm.Show();

                List<ChatMessage> matchingMessages = new List<ChatMessage>();

                await Task.Run(() =>
                {
                    foreach (ChatMessage message in chatMessages)
                    {
                        if (message.MessageText.Contains(searchText))
                        {
                            matchingMessages.Add(message);
                        }

                        if (!progressForm.IsDisposed)
                        {
                            if (progressBar.InvokeRequired)
                            {
                                progressBar.Invoke(new Action(() =>
                                {
                                    progressBar.Value++;
                                }));
                            }
                            else
                            {
                                progressBar.Value++;
                            }
                        }
                    }
                });

                progressForm.Close();

                mainPanel.Controls.Clear();

                foreach (var message in matchingMessages)
                {
                    Panel messagePanel = CreateMessagePanel();
                    PopulateMessageLabels(messagePanel, message);
                    mainPanel.Controls.Add(messagePanel);
                    inSearchMode = true;
                }
            }
        }

        private void Main_FormClosing(object sender, FormClosingEventArgs e)
        {

            Application.Exit();

        }

        private void RefreshDisplayedMessages()
        {
            addedPanels.Clear();

            foreach (var message in displayedMessages)
            {
                Panel messagePanel = CreateMessagePanel();
                PopulateMessageLabels(messagePanel, message);
                addedPanels.Add(messagePanel);
            }

            mainPanel.Controls.Clear();

            foreach (var messagePanel in addedPanels)
            {
                mainPanel.Controls.Add(messagePanel);
            }
        }

        private void mainPanel_Paint(object sender, PaintEventArgs e)
        {

        }
    }
}
