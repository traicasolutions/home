# Google Form Setup Guide

Follow these steps to connect your course registration form to Google Forms:

## Step 1: Create the Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Click **+ Blank** to create a new form
3. Title it: **Course Registration - Trica Solutions**

## Step 2: Add Form Fields

Add the following questions in order:

### Question 1: Full Name
- Type: **Short answer**
- Label: `Full Name`
- Mark as **Required**

### Question 2: Email Address
- Type: **Short answer**
- Label: `Email Address`
- Click ⋮ (three dots) → **Response validation**
- Add validation: Text → Email address
- Mark as **Required**

### Question 3: Contact Number
- Type: **Short answer**
- Label: `Contact Number`
- Mark as **Required**

### Question 4: Select Courses
- Type: **Checkboxes** (allows multiple selection)
- Label: `Select Courses (You can select multiple)`
- Options:
  - `Advanced DevOps with Kubernetes and Docker`
  - `College to Corporate – DevOps Cloud Accelerator`
  - `Basics of Python for Beginners`
  - `Beginner QA Engineer Training Programme`
- Mark as **Required**

### Question 5: Additional Message
- Type: **Paragraph**
- Label: `Additional Message`
- Leave as **Optional** (don't mark required)

## Step 3: Get Form Field IDs

1. Click the **Send** button (top right)
2. Click the **<>** (Link icon)
3. Copy the form URL (looks like: `https://docs.google.com/forms/d/e/FORM_ID/viewform`)
4. Open the form in a new tab
5. Right-click on the page → **Inspect** (or press F12)
6. In the Console tab, paste this code and press Enter:

```javascript
const fields = document.querySelectorAll('input[name^="entry."], textarea[name^="entry."]');
fields.forEach(field => {
  const label = field.closest('.Qr7Oae')?.querySelector('.M7eMe') || 
                field.closest('.geS5n')?.querySelector('.M7eMe');
  console.log(label?.innerText, '→', field.getAttribute('name'));
});
```

7. This will show you the field names like:
```
Full Name → entry.123456789
Email Address → entry.987654321
Contact Number → entry.456789123
Select Courses → entry.789123456
Additional Message → entry.321654987
```

## Step 4: Update Your Website Code

1. Open `src/app/page.js`
2. Find the form tag (around line 220)
3. Replace the placeholders:

**Replace:**
```javascript
action="https://docs.google.com/forms/u/0/d/e/YOUR_FORM_ID/formResponse"
```

**With your actual Form ID from Step 3:**
```javascript
action="https://docs.google.com/forms/d/e/YOUR_ACTUAL_FORM_ID/formResponse"
```

4. Update each field's `name` attribute with the correct entry IDs:

**Full Name:**
```javascript
name="entry.123456789"  // Replace with your actual entry ID
```

**Email:**
```javascript
name="entry.987654321"  // Replace with your actual entry ID
```

**Phone:**
```javascript
name="entry.456789123"  // Replace with your actual entry ID
```

**Courses (all 4 checkboxes):**
```javascript
name="entry.789123456"  // Replace with your actual entry ID (same for all checkboxes)
```

**Message:**
```javascript
name="entry.321654987"  // Replace with your actual entry ID
```

## Step 5: Test the Form

1. Save your changes to `page.js`
2. Run `npm run dev` locally
3. Navigate to the registration section
4. Fill out and submit the form
5. Check your Google Form responses to confirm data is being received

## Step 6: Set Up Email Notifications (Optional)

1. Open your Google Form
2. Click the **Responses** tab
3. Click ⋮ (three dots) → **Get email notifications for new responses**
4. This will send you an email every time someone registers

## Step 7: View Form Responses

You can view responses in two ways:

1. **In Google Forms:**
   - Open your form
   - Click the **Responses** tab

2. **In Google Sheets:**
   - In the Responses tab, click the green Sheets icon
   - This creates a linked spreadsheet with all responses

## Troubleshooting

- **Form not submitting?** Check that the form ID and entry IDs are correct
- **Missing data?** Verify each field name matches the entry ID from the Google Form
- **Need to test?** The form opens in a new tab, so you can see if submission succeeded

## Notes

- Submissions will open Google Forms' success page in a new tab
- The form will NOT reset automatically after submission (this is a Google Forms limitation)
- All responses are automatically saved to your Google account
- You can download responses as CSV from Google Forms or Sheets
