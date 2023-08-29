namespace telegramExportReader
{
    partial class Main
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Main));
            textBox1 = new System.Windows.Forms.TextBox();
            profilePicture = new System.Windows.Forms.PictureBox();
            message = new System.Windows.Forms.Panel();
            messageDate = new System.Windows.Forms.Label();
            authorLabel = new System.Windows.Forms.Label();
            messageText = new System.Windows.Forms.Label();
            mainPanel = new System.Windows.Forms.Panel();
            linkLabel1 = new System.Windows.Forms.LinkLabel();
            ((System.ComponentModel.ISupportInitialize)profilePicture).BeginInit();
            message.SuspendLayout();
            mainPanel.SuspendLayout();
            SuspendLayout();
            // 
            // textBox1
            // 
            textBox1.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            textBox1.Location = new System.Drawing.Point(239, 14);
            textBox1.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            textBox1.Name = "textBox1";
            textBox1.Size = new System.Drawing.Size(457, 23);
            textBox1.TabIndex = 0;
            textBox1.Text = "Search";
            textBox1.TextChanged += textBox1_TextChanged;
            // 
            // profilePicture
            // 
            profilePicture.AccessibleName = "Profile Picture";
            profilePicture.AccessibleRole = System.Windows.Forms.AccessibleRole.Graphic;
            profilePicture.Image = (System.Drawing.Image)resources.GetObject("profilePicture.Image");
            profilePicture.Location = new System.Drawing.Point(4, 3);
            profilePicture.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            profilePicture.Name = "profilePicture";
            profilePicture.Size = new System.Drawing.Size(58, 58);
            profilePicture.TabIndex = 1;
            profilePicture.TabStop = false;
            profilePicture.Click += profilePicture_Click;
            // 
            // message
            // 
            message.AutoSize = true;
            message.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            message.Controls.Add(messageDate);
            message.Controls.Add(authorLabel);
            message.Controls.Add(messageText);
            message.Controls.Add(profilePicture);
            message.Location = new System.Drawing.Point(20, 17);
            message.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            message.Name = "message";
            message.Size = new System.Drawing.Size(822, 191);
            message.TabIndex = 2;
            message.Visible = false;
            message.Paint += panel1_Paint;
            // 
            // messageDate
            // 
            messageDate.AutoSize = true;
            messageDate.ForeColor = System.Drawing.SystemColors.ButtonShadow;
            messageDate.Location = new System.Drawing.Point(152, 13);
            messageDate.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            messageDate.Name = "messageDate";
            messageDate.Size = new System.Drawing.Size(106, 15);
            messageDate.TabIndex = 4;
            messageDate.Text = "24.08.2023 15:29:56";
            // 
            // authorLabel
            // 
            authorLabel.AutoSize = true;
            authorLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point);
            authorLabel.ForeColor = System.Drawing.SystemColors.ControlDark;
            authorLabel.Location = new System.Drawing.Point(69, 3);
            authorLabel.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            authorLabel.Name = "authorLabel";
            authorLabel.Size = new System.Drawing.Size(65, 24);
            authorLabel.TabIndex = 2;
            authorLabel.Text = "Name";
            // 
            // messageText
            // 
            messageText.AutoSize = true;
            messageText.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            messageText.ForeColor = System.Drawing.SystemColors.ButtonHighlight;
            messageText.Location = new System.Drawing.Point(69, 31);
            messageText.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            messageText.MaximumSize = new System.Drawing.Size(758, 0);
            messageText.Name = "messageText";
            messageText.Size = new System.Drawing.Size(749, 160);
            messageText.TabIndex = 3;
            messageText.Text = resources.GetString("messageText.Text");
            // 
            // mainPanel
            // 
            mainPanel.AutoScroll = true;
            mainPanel.Controls.Add(message);
            mainPanel.Location = new System.Drawing.Point(14, 44);
            mainPanel.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            mainPanel.Name = "mainPanel";
            mainPanel.Size = new System.Drawing.Size(948, 661);
            mainPanel.TabIndex = 3;
            mainPanel.Paint += mainPanel_Paint;
            // 
            // linkLabel1
            // 
            linkLabel1.AutoSize = true;
            linkLabel1.LinkBehavior = System.Windows.Forms.LinkBehavior.NeverUnderline;
            linkLabel1.LinkColor = System.Drawing.SystemColors.GradientActiveCaption;
            linkLabel1.Location = new System.Drawing.Point(31, 16);
            linkLabel1.Name = "linkLabel1";
            linkLabel1.Size = new System.Drawing.Size(201, 15);
            linkLabel1.TabIndex = 4;
            linkLabel1.TabStop = true;
            linkLabel1.Text = "About | Report Bug | Feature Request";
            linkLabel1.LinkClicked += linkLabel1_LinkClicked;
            // 
            // Main
            // 
            AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            BackColor = System.Drawing.Color.FromArgb(14, 22, 33);
            ClientSize = new System.Drawing.Size(976, 719);
            Controls.Add(linkLabel1);
            Controls.Add(mainPanel);
            Controls.Add(textBox1);
            FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            Icon = (System.Drawing.Icon)resources.GetObject("$this.Icon");
            Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            Name = "Main";
            Text = "Main";
            FormClosing += Main_FormClosing;
            Load += Main_Load_1;
            ((System.ComponentModel.ISupportInitialize)profilePicture).EndInit();
            message.ResumeLayout(false);
            message.PerformLayout();
            mainPanel.ResumeLayout(false);
            mainPanel.PerformLayout();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.PictureBox profilePicture;
        private System.Windows.Forms.Panel message;
        private System.Windows.Forms.Label messageText;
        private System.Windows.Forms.Panel mainPanel;
        private System.Windows.Forms.Label messageDate;
        private System.Windows.Forms.Label authorLabel;
        private System.Windows.Forms.LinkLabel linkLabel1;
    }
}