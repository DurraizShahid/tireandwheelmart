-- Seed default AI voice configuration
insert into public.site_settings (key, value, created_at, updated_at)
select 'ai_voice_config',
  jsonb_set(
    '{
  "provider": "openai",
  "speechProvider": "openai",
  "apiKey": "",
  "model": "gpt-4o-realtime-preview",
  "voice": "alloy",
  "temperature": 0.7,
  "systemPrompt": "You are a helpful AI assistant for Tire & Wheel Mart. Your goal is to assist customers with their tire and wheel needs, qualify leads, and schedule appointments. Be friendly, professional, and concise.",
  "greeting": "Hello! This is an AI assistant from Tire & Wheel Mart. How can I help you today?",
  "businessInfo": {
    "name": "Tire & Wheel Mart",
    "description": "Premium tire and wheel retailer",
    "hours": "Mon-Fri 9am-6pm, Sat 10am-4pm",
    "phone": "",
    "website": "",
    "address": "",
    "services": ["Tire Sales", "Wheel Sales", "Installation", "Balancing", "Alignment"]
  },
  "languages": ["en"],
  "transferRules": [],
  "callObjectives": [],
  "conversationGuidelines": [
    {"id":"guideline-1","rule":"Be concise and conversational — keep responses brief and natural.","enabled":true},
    {"id":"guideline-2","rule":"Verify the caller\u0027s identity if they claim to be a known contact.","enabled":true},
    {"id":"guideline-3","rule":"Do not make up pricing or availability — use available tools to check.","enabled":true},
    {"id":"guideline-4","rule":"If you cannot answer with confidence, transfer to a human agent.","enabled":true},
    {"id":"guideline-5","rule":"If the customer asks to speak to a human, transfer immediately.","enabled":true},
    {"id":"guideline-6","rule":"Complete all required call objectives before ending the call.","enabled":true},
    {"id":"guideline-7","rule":"Use tools to look up information rather than guessing.","enabled":true},
    {"id":"guideline-8","rule":"End the conversation politely after objectives are met or the customer indicates they are done.","enabled":true}
  ],
  "toolDefinitions": [
    {"id":"tool-1","name":"get_lead_info","description":"Fetch detailed lead information by lead ID","parameters":{"type":"object","properties":{"leadId":{"type":"string","description":"The lead UUID"}},"required":["leadId"]},"enabled":true},
    {"id":"tool-2","name":"get_customer_history","description":"Fetch customer order history by customer ID","parameters":{"type":"object","properties":{"customerId":{"type":"string","description":"The customer UUID"}},"required":["customerId"]},"enabled":true},
    {"id":"tool-3","name":"get_opportunity_status","description":"Fetch opportunity details linked to a lead","parameters":{"type":"object","properties":{"leadId":{"type":"string","description":"The lead UUID"}},"required":["leadId"]},"enabled":true},
    {"id":"tool-4","name":"get_vehicle_fitments","description":"Look up tire and wheel fitments by vehicle make, model, and year","parameters":{"type":"object","properties":{"make":{"type":"string","description":"Vehicle make"},"model":{"type":"string","description":"Vehicle model"},"year":{"type":"number","description":"Vehicle year"}},"required":["make","model","year"]},"enabled":true},
    {"id":"tool-5","name":"get_active_promotions","description":"Get currently active promotions and deals","parameters":{"type":"object","properties":{}},"enabled":true},
    {"id":"tool-6","name":"search_products","description":"Search for products by name, brand, or keyword","parameters":{"type":"object","properties":{"query":{"type":"string","description":"Search query text"}},"required":["query"]},"enabled":true},
    {"id":"tool-7","name":"update_lead_status","description":"Update the status of a lead","parameters":{"type":"object","properties":{"leadId":{"type":"string","description":"The lead UUID"},"status":{"type":"string","enum":["new","contacted","qualified","disqualified","won","lost"],"description":"New status value"}},"required":["leadId","status"]},"enabled":true},
    {"id":"tool-8","name":"schedule_callback","description":"Schedule a callback for a lead at a specific date/time","parameters":{"type":"object","properties":{"leadId":{"type":"string","description":"The lead UUID"},"datetime":{"type":"string","description":"ISO 8601 datetime for the callback"},"notes":{"type":"string","description":"Notes about the callback"}},"required":["leadId","datetime"]},"enabled":true},
    {"id":"tool-9","name":"create_task","description":"Create a task activity for a lead","parameters":{"type":"object","properties":{"leadId":{"type":"string","description":"The lead UUID"},"description":{"type":"string","description":"Task description"},"dueDate":{"type":"string","description":"ISO 8601 due date"}},"required":["leadId","description","dueDate"]},"enabled":true},
    {"id":"tool-10","name":"transfer_to_human","description":"Transfer the conversation to a human agent. Call this when the customer requests a human, asks about pricing you cannot confirm, or the conversation requires human judgment.","parameters":{"type":"object","properties":{"reason":{"type":"string","description":"Reason for the transfer"}},"required":["reason"]},"enabled":true}
  ],
  "promptAssembly": {
    "maxFeaturedProducts": 10,
    "maxRecentCalls": 5,
    "maxPromptLength": 8000,
    "defaultMaxTurns": 50,
    "defaultMaxDurationSeconds": 600
  },
  "enabled": false,
  "updatedBy": "system"
}'::jsonb,
    '{updatedAt}',
    to_jsonb(to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'))
  ),
  now(), now()
where not exists (
  select 1 from public.site_settings where key = 'ai_voice_config'
);
