namespace telegramExportReader
{
    partial class Form1
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            folderBrowserDialog1 = new System.Windows.Forms.FolderBrowserDialog();
            button1 = new System.Windows.Forms.Button();
            progressBar1 = new System.Windows.Forms.ProgressBar();
            processingProgress = new System.Windows.Forms.Panel();
            label1 = new System.Windows.Forms.Label();
            loadLastFile = new System.Windows.Forms.Button();
            buttonsPanel = new System.Windows.Forms.Panel();
            linkLabel1 = new System.Windows.Forms.LinkLabel();
            label2 = new System.Windows.Forms.Label();
            processingProgress.SuspendLayout();
            buttonsPanel.SuspendLayout();
            SuspendLayout();
            // 
            // button1
            // 
            button1.AccessibleDescription = "button to select a folder with chat history";
            button1.AccessibleName = "Select a folder button";
            button1.BackColor = System.Drawing.Color.FromArgb(47, 110, 165);
            button1.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            button1.Cursor = System.Windows.Forms.Cursors.Hand;
            button1.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            button1.Font = new System.Drawing.Font("Myanmar Text", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            button1.ForeColor = System.Drawing.Color.WhiteSmoke;
            button1.Location = new System.Drawing.Point(66, 58);
            button1.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            button1.Name = "button1";
            button1.Size = new System.Drawing.Size(298, 47);
            button1.TabIndex = 0;
            button1.Text = "Select a folder";
            button1.UseVisualStyleBackColor = false;
            button1.Click += button1_Click;
            // 
            // progressBar1
            // 
            progressBar1.Location = new System.Drawing.Point(63, 68);
            progressBar1.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            progressBar1.Name = "progressBar1";
            progressBar1.Size = new System.Drawing.Size(298, 32);
            progressBar1.TabIndex = 1;
            // 
            // processingProgress
            // 
            processingProgress.Controls.Add(label1);
            processingProgress.Controls.Add(progressBar1);
            processingProgress.Location = new System.Drawing.Point(224, 212);
            processingProgress.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            processingProgress.Name = "processingProgress";
            processingProgress.Size = new System.Drawing.Size(418, 115);
            processingProgress.TabIndex = 2;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            label1.ForeColor = System.Drawing.SystemColors.ButtonFace;
            label1.Location = new System.Drawing.Point(127, 36);
            label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            label1.Name = "label1";
            label1.Size = new System.Drawing.Size(164, 18);
            label1.TabIndex = 2;
            label1.Text = "Processing, please wait";
            // 
            // loadLastFile
            // 
            loadLastFile.AccessibleDescription = "button to load last processed file";
            loadLastFile.AccessibleName = "Load last file";
            loadLastFile.AutoEllipsis = true;
            loadLastFile.BackColor = System.Drawing.Color.FromArgb(47, 110, 165);
            loadLastFile.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            loadLastFile.Cursor = System.Windows.Forms.Cursors.Hand;
            loadLastFile.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            loadLastFile.Font = new System.Drawing.Font("Myanmar Text", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            loadLastFile.ForeColor = System.Drawing.Color.WhiteSmoke;
            loadLastFile.Location = new System.Drawing.Point(66, 3);
            loadLastFile.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            loadLastFile.Name = "loadLastFile";
            loadLastFile.Size = new System.Drawing.Size(298, 47);
            loadLastFile.TabIndex = 3;
            loadLastFile.Text = "Load Last File";
            loadLastFile.UseVisualStyleBackColor = false;
            loadLastFile.Click += loadLastFile_Click_1;
            // 
            // buttonsPanel
            // 
            buttonsPanel.Controls.Add(button1);
            buttonsPanel.Controls.Add(loadLastFile);
            buttonsPanel.Location = new System.Drawing.Point(224, 335);
            buttonsPanel.Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            buttonsPanel.Name = "buttonsPanel";
            buttonsPanel.Size = new System.Drawing.Size(420, 120);
            buttonsPanel.TabIndex = 4;
            // 
            // linkLabel1
            // 
            linkLabel1.AutoSize = true;
            linkLabel1.LinkBehavior = System.Windows.Forms.LinkBehavior.NeverUnderline;
            linkLabel1.LinkColor = System.Drawing.SystemColors.GradientActiveCaption;
            linkLabel1.Location = new System.Drawing.Point(339, 492);
            linkLabel1.Name = "linkLabel1";
            linkLabel1.Size = new System.Drawing.Size(201, 15);
            linkLabel1.TabIndex = 5;
            linkLabel1.TabStop = true;
            linkLabel1.Text = "About | Report Bug | Feature Request";
            linkLabel1.LinkClicked += linkLabel1_LinkClicked;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Font = new System.Drawing.Font("Segoe UI Black", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point);
            label2.ForeColor = System.Drawing.SystemColors.ButtonHighlight;
            label2.Location = new System.Drawing.Point(287, 140);
            label2.Name = "label2";
            label2.Size = new System.Drawing.Size(282, 25);
            label2.TabIndex = 7;
            label2.Text = "Telegram Chat ExportReader";
            // 
            // Form1
            // 
            AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            BackColor = System.Drawing.Color.FromArgb(23, 33, 43);
            ClientSize = new System.Drawing.Size(840, 516);
            Controls.Add(label2);
            Controls.Add(linkLabel1);
            Controls.Add(buttonsPanel);
            Controls.Add(processingProgress);
            FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            Icon = (System.Drawing.Icon)resources.GetObject("$this.Icon");
            Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            Name = "Form1";
            RightToLeftLayout = true;
            Text = "Exported Chat Viewer";
            Load += Form1_Load;
            processingProgress.ResumeLayout(false);
            processingProgress.PerformLayout();
            buttonsPanel.ResumeLayout(false);
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private System.Windows.Forms.FolderBrowserDialog folderBrowserDialog1;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.ProgressBar progressBar1;
        private System.Windows.Forms.Panel processingProgress;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button loadLastFile;
        private System.Windows.Forms.Panel buttonsPanel;
        private System.Windows.Forms.LinkLabel linkLabel1;
        private System.Windows.Forms.Label label2;
    }
}

