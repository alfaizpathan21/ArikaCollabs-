/**
 * Google Sheets Integration Service for ARIKA COLLABS
 *
 * Sends website inquiry data to Google Sheets through:
 * 1. Express backend proxy: /api/google-sheets
 * 2. Google Apps Script Web App as fallback
 */

export interface GoogleSheetsInquiryData {
    fullName?: string;
    name?: string;

    company?: string;
    companyName?: string;

    email?: string;
    emailAddress?: string;
    user_email?: string;
    from_email?: string;

    phone?: string;
    phoneCoordinate?: string;

    inquiryType?: string;
    service?: string;

    message?: string;
    campaignMessage?: string;
}

export interface GoogleSheetsSubmissionResult {
    success: boolean;
    message: string;
    error?: string;
}

const SUCCESS_MESSAGE =
    "Thank you for reaching out. Your inquiry has been received successfully. Our team will get back to you shortly.";

const ERROR_MESSAGE =
    "Something went wrong while submitting your inquiry. Please try again.";

/**
 * Safely convert a value to trimmed string
 */
function clean(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).trim();
}

/**
 * Submits inquiry data to Google Sheets
 */
export async function submitToGoogleSheets(
    formData: GoogleSheetsInquiryData
): Promise<GoogleSheetsSubmissionResult> {

    const scriptUrl = clean(
        import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL
    );

    /**
     * -----------------------------------------
     * 1. Normalize form data
     * -----------------------------------------
     */

    const fullName = clean(
        formData.fullName || formData.name
    );

    const companyName = clean(
        formData.companyName || formData.company
    );

    const email = clean(
        formData.email ||
        formData.emailAddress ||
        formData.user_email ||
        formData.from_email
    );

    const phone = clean(
        formData.phone ||
        formData.phoneCoordinate
    );

    const inquiryType = clean(
        formData.inquiryType ||
        formData.service ||
        "Campaign Inquiry"
    );

    const campaignMessage = clean(
        formData.campaignMessage ||
        formData.message
    );

    const timestamp = new Date().toISOString();


    /**
     * -----------------------------------------
     * 2. Create ONE clean payload
     * -----------------------------------------
     *
     * IMPORTANT:
     * Do not send multiple aliases for the same field.
     */

    const payload = {
        fullName,
        companyName,
        email,
        phone,
        inquiryType,
        campaignMessage,
        timestamp
    };


    console.log(
        "[Google Sheets] Sending payload:",
        payload
    );


    /**
     * -----------------------------------------
     * 3. Try Express backend first
     * -----------------------------------------
     */

    try {

        const proxyResponse = await fetch(
            "/api/google-sheets",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)
            }
        );


        if (proxyResponse.ok) {

            const data =
                await proxyResponse.json();

            console.log(
                "[Google Sheets] Proxy response:",
                data
            );


            if (data?.success === true) {

                return {
                    success: true,
                    message: SUCCESS_MESSAGE
                };

            }

        } else {

            console.warn(
                "[Google Sheets] Proxy returned:",
                proxyResponse.status,
                proxyResponse.statusText
            );

        }

    } catch (error) {

        console.warn(
            "[Google Sheets] Backend proxy failed:",
            error
        );

    }


    /**
     * -----------------------------------------
     * 4. Google Apps Script fallback
     * -----------------------------------------
     */

    if (
        scriptUrl &&
        !scriptUrl.includes(
            "YOUR_GOOGLE_APPS_SCRIPT_URL"
        )
    ) {

        try {

            await fetch(
                scriptUrl,
                {
                    method: "POST",

                    mode: "no-cors",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify(payload)
                }
            );


            /**
             * IMPORTANT:
             *
             * Because no-cors is being used,
             * the browser cannot read the response
             * from Google Apps Script.
             *
             * Therefore we cannot verify the
             * Apps Script response here.
             */

            console.log(
                "[Google Sheets] Data sent to Apps Script."
            );


            return {
                success: true,
                message: SUCCESS_MESSAGE
            };


        } catch (error) {

            console.error(
                "[Google Sheets] Apps Script submission failed:",
                error
            );

        }

    } else {

        console.warn(
            "[Google Sheets] Google Apps Script URL is not configured."
        );

    }


    /**
     * -----------------------------------------
     * 5. Both methods failed
     * -----------------------------------------
     */

    return {
        success: false,
        message: ERROR_MESSAGE,
        error:
            "Unable to submit inquiry to Google Sheets."
    };
}