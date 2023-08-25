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
            this.folderBrowserDialog1 = new System.Windows.Forms.FolderBrowserDialog();
            this.button1 = new System.Windows.Forms.Button();
            this.progressBar1 = new System.Windows.Forms.ProgressBar();
            this.processingProgress = new System.Windows.Forms.Panel();
            this.label1 = new System.Windows.Forms.Label();
            this.loadLastFile = new System.Windows.Forms.Button();
            this.buttonsPanel = new System.Windows.Forms.Panel();
            this.processingProgress.SuspendLayout();
            this.buttonsPanel.SuspendLayout();
            this.SuspendLayout();
            // 
            // button1
            // 
            this.button1.AccessibleDescription = "button to select a folder with chat history";
            this.button1.AccessibleName = "Select a folder button";
            this.button1.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(47)))), ((int)(((byte)(110)))), ((int)(((byte)(165)))));
            this.button1.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.button1.Cursor = System.Windows.Forms.Cursors.Hand;
            this.button1.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.button1.Font = new System.Drawing.Font("Myanmar Text", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.button1.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.button1.Location = new System.Drawing.Point(57, 50);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(255, 41);
            this.button1.TabIndex = 0;
            this.button1.Text = "Select a folder";
            this.button1.UseVisualStyleBackColor = false;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // progressBar1
            // 
            this.progressBar1.Location = new System.Drawing.Point(54, 59);
            this.progressBar1.Name = "progressBar1";
            this.progressBar1.Size = new System.Drawing.Size(255, 28);
            this.progressBar1.TabIndex = 1;
            // 
            // processingProgress
            // 
            this.processingProgress.Controls.Add(this.label1);
            this.processingProgress.Controls.Add(this.progressBar1);
            this.processingProgress.Location = new System.Drawing.Point(175, 184);
            this.processingProgress.Name = "processingProgress";
            this.processingProgress.Size = new System.Drawing.Size(358, 100);
            this.processingProgress.TabIndex = 2;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label1.ForeColor = System.Drawing.SystemColors.ButtonFace;
            this.label1.Location = new System.Drawing.Point(99, 29);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(164, 18);
            this.label1.TabIndex = 2;
            this.label1.Text = "Processing, please wait";
            // 
            // loadLastFile
            // 
            this.loadLastFile.AccessibleDescription = "button to load last processed file";
            this.loadLastFile.AccessibleName = "Load last file";
            this.loadLastFile.AutoEllipsis = true;
            this.loadLastFile.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(47)))), ((int)(((byte)(110)))), ((int)(((byte)(165)))));
            this.loadLastFile.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.loadLastFile.Cursor = System.Windows.Forms.Cursors.Hand;
            this.loadLastFile.FlatStyle = System.Windows.Forms.FlatStyle.Popup;
            this.loadLastFile.Font = new System.Drawing.Font("Myanmar Text", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.loadLastFile.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.loadLastFile.Location = new System.Drawing.Point(57, 3);
            this.loadLastFile.Name = "loadLastFile";
            this.loadLastFile.Size = new System.Drawing.Size(255, 41);
            this.loadLastFile.TabIndex = 3;
            this.loadLastFile.Text = "Load Last File";
            this.loadLastFile.UseVisualStyleBackColor = false;
            this.loadLastFile.Click += new System.EventHandler(this.loadLastFile_Click_1);
            // 
            // buttonsPanel
            // 
            this.buttonsPanel.Controls.Add(this.button1);
            this.buttonsPanel.Controls.Add(this.loadLastFile);
            this.buttonsPanel.Location = new System.Drawing.Point(175, 290);
            this.buttonsPanel.Name = "buttonsPanel";
            this.buttonsPanel.Size = new System.Drawing.Size(360, 104);
            this.buttonsPanel.TabIndex = 4;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(23)))), ((int)(((byte)(33)))), ((int)(((byte)(43)))));
            this.ClientSize = new System.Drawing.Size(720, 447);
            this.Controls.Add(this.buttonsPanel);
            this.Controls.Add(this.processingProgress);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "Form1";
            this.RightToLeftLayout = true;
            this.Text = "Exported Chat Viewer";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.processingProgress.ResumeLayout(false);
            this.processingProgress.PerformLayout();
            this.buttonsPanel.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.FolderBrowserDialog folderBrowserDialog1;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.ProgressBar progressBar1;
        private System.Windows.Forms.Panel processingProgress;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button loadLastFile;
        private System.Windows.Forms.Panel buttonsPanel;
    }
}

