export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('Agentic Form Filler: Robust Mode Active');

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'SCAN_FORM') {
        const fields = extractFormFields();
        sendResponse(fields);
      } else if (message.action === 'FILL_FORM') {
        fillFormFields(message.data);
        sendResponse({ status: 'done' });
      }
      return true;
    });
  },
});

function getLabel(el: HTMLElement): string {
  const isChoice = el.getAttribute('role') === 'radio' || el.getAttribute('role') === 'checkbox' || (el as any).type === 'radio' || (el as any).type === 'checkbox';

  // 1. Standard label elements
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
    if (el.labels && el.labels.length > 0) {
      return el.labels[0].innerText.trim();
    }
  }

  // 2. Specific Option Label (for Radio/Checkbox)
  // Look for text immediately inside or next to the element
  let optionText = el.getAttribute('aria-label') || '';
  if (!optionText && isChoice) {
    // Check siblings or parent for text (typical for Google/Microsoft Forms)
    optionText = el.parentElement?.innerText.replace(/\n/g, ' ').trim() || '';
  }

  // 3. Question Title Context
  // Find the container that holds the whole question
  const questionContainer = el.closest('[role="listitem"], [data-automation-id="questionItem"], .page-section, fieldset');
  let questionTitle = '';
  if (questionContainer) {
    const titleEl = questionContainer.querySelector('[data-automation-id="questionTitle"], .office-form-question-title, [role="heading"], legend');
    if (titleEl) questionTitle = (titleEl as HTMLElement).innerText.trim();
  }

  // Combine them: "Gender: Male" is better than just "Male" or "Gender"
  if (questionTitle && optionText && isChoice) {
    // If optionText already contains the title, don't duplicate
    if (optionText.includes(questionTitle)) return optionText;
    return `${questionTitle}: ${optionText}`;
  }

  if (optionText) return optionText;
  if (questionTitle) return questionTitle;

  // 4. Aria LabelledBy fallback
  const ariaLabelledBy = el.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelledBy = document.getElementById(ariaLabelledBy);
    if (labelledBy) return labelledBy.innerText.trim();
  }

  // 5. Placeholder fallback
  const placeholder = el.getAttribute('placeholder');
  if (placeholder) return placeholder;

  return el.getAttribute('name') || el.id || 'Unknown Field';
}

function extractFormFields() {
  // Broaden selectors for complex forms
  const selectors = [
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"])',
    'textarea',
    'select',
    '[role="textbox"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[contenteditable="true"]'
  ].join(',');

  const inputs = document.querySelectorAll(selectors);
  
  return Array.from(inputs).map((el: any, index) => {
    // ID BRIDGE: Assign a temporary unique ID for 100% accurate targeting
    const agentId = `agent-${index}-${Math.random().toString(36).slice(2, 7)}`;
    el.setAttribute('data-form-agent-id', agentId);

    return {
      id: agentId, // Use the bridge ID as the primary key for the AI
      name: el.name || '',
      type: el.type || el.getAttribute('role') || (el.contentEditable === 'true' ? 'richtext' : el.tagName.toLowerCase()),
      placeholder: el.placeholder || '',
      label: getLabel(el),
      context: el.parentElement?.innerText.slice(0, 100).replace(/\s+/g, ' ').trim(), // Extra context
    };
  });
}

function fillFormFields(data: Record<string, string>) {
  Object.entries(data).forEach(([agentId, value]) => {
    // TARGETING: Use the precise ID Bridge we assigned during extraction
    const el = document.querySelector(`[data-form-agent-id="${agentId}"]`) as any;

    if (!el) {
      console.warn(`Agent could not find element with ID: ${agentId}`);
      return;
    }

    console.log(`Filling ${agentId} with ${value}`);

    if (el.type === 'checkbox' || el.type === 'radio' || el.getAttribute('role') === 'checkbox' || el.getAttribute('role') === 'radio') {
      const isChecked = el.checked || el.getAttribute('aria-checked') === 'true';
      const shouldCheck = value === 'true' || value === 'checked' || value === el.value;
      
      if (isChecked !== shouldCheck) {
        el.click(); // Most reliable for complex forms like Google/Microsoft
      }
    } else if (el.tagName === 'DIV' || el.contentEditable === 'true' || el.getAttribute('role') === 'textbox') {
      el.innerText = value;
    } else {
      el.value = value;
    }

    // Comprehensive event simulation to bypass framework state locks
    const events = ['input', 'change', 'blur', 'focus'];
    events.forEach(name => {
      el.dispatchEvent(new Event(name, { bubbles: true }));
    });
  });
}
