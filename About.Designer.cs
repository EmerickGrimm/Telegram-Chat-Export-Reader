namespace telegramExportReader
{
    partial class About
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
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
            panel1 = new System.Windows.Forms.Panel();
            linkLabel1 = new System.Windows.Forms.LinkLabel();
            gitLink = new System.Windows.Forms.LinkLabel();
            label2 = new System.Windows.Forms.Label();
            aboutHeader = new System.Windows.Forms.Label();
            panel1.SuspendLayout();
            SuspendLayout();
            // 
            // panel1
            // 
            panel1.Controls.Add(linkLabel1);
            panel1.Controls.Add(gitLink);
            panel1.Controls.Add(label2);
            panel1.Controls.Add(aboutHeader);
            panel1.Location = new System.Drawing.Point(13, 13);
            panel1.Name = "panel1";
            panel1.Size = new System.Drawing.Size(481, 120);
            panel1.TabIndex = 0;
            // 
            // linkLabel1
            // 
            linkLabel1.AccessibleDescription = "Link to Git page";
            linkLabel1.AutoSize = true;
            linkLabel1.Font = new System.Drawing.Font("Segoe UI", 11F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            linkLabel1.LinkColor = System.Drawing.Color.Cyan;
            linkLabel1.Location = new System.Drawing.Point(229, 100);
            linkLabel1.Name = "linkLabel1";
            linkLabel1.Size = new System.Drawing.Size(86, 20);
            linkLabel1.TabIndex = 3;
            linkLabel1.TabStop = true;
            linkLabel1.Text = "License MIT";
            linkLabel1.LinkClicked += linkLabel1_LinkClicked;
            // 
            // gitLink
            // 
            gitLink.AccessibleDescription = "Link to Git page";
            gitLink.AutoSize = true;
            gitLink.Font = new System.Drawing.Font("Segoe UI", 11F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            gitLink.LinkColor = System.Drawing.Color.Cyan;
            gitLink.Location = new System.Drawing.Point(136, 100);
            gitLink.Name = "gitLink";
            gitLink.Size = new System.Drawing.Size(87, 20);
            gitLink.TabIndex = 2;
            gitLink.TabStop = true;
            gitLink.Text = "Project's Git";
            gitLink.LinkClicked += gitLink_LinkClicked;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Font = new System.Drawing.Font("Segoe UI", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            label2.ForeColor = System.Drawing.SystemColors.ButtonHighlight;
            label2.Location = new System.Drawing.Point(42, 30);
            label2.MaximumSize = new System.Drawing.Size(400, 0);
            label2.Name = "label2";
            label2.Size = new System.Drawing.Size(400, 60);
            label2.TabIndex = 1;
            label2.Text = "This is an open source project created by Emerick Grimm. If you have found a bug or want to suggest a feature, you can do it on the project page. ";
            // 
            // aboutHeader
            // 
            aboutHeader.AutoSize = true;
            aboutHeader.Font = new System.Drawing.Font("Segoe UI Black", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point);
            aboutHeader.ForeColor = System.Drawing.SystemColors.ButtonHighlight;
            aboutHeader.Location = new System.Drawing.Point(136, 0);
            aboutHeader.Name = "aboutHeader";
            aboutHeader.Size = new System.Drawing.Size(200, 21);
            aboutHeader.TabIndex = 0;
            aboutHeader.Text = "Telegram Export Reader";
            // 
            // About
            // 
            AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            BackColor = System.Drawing.Color.FromArgb(23, 33, 43);
            ClientSize = new System.Drawing.Size(507, 146);
            Controls.Add(panel1);
            FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            Margin = new System.Windows.Forms.Padding(4, 3, 4, 3);
            MaximizeBox = false;
            MinimizeBox = false;
            Name = "About";
            Padding = new System.Windows.Forms.Padding(10);
            ShowIcon = false;
            ShowInTaskbar = false;
            StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            Text = "About";
            panel1.ResumeLayout(false);
            panel1.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label aboutHeader;
        private System.Windows.Forms.LinkLabel gitLink;
        private System.Windows.Forms.LinkLabel linkLabel1;
    }
}
