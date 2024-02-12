# patient-crm

### HOW TO RUN

#### Backend

if you have go installed locally, you can do

```
cd backend && go run .
```

if you have docker installed locally, you can do

```
make build && make up
```

Both serves the backend via port 3000

#### Frontend

Assuming that you have node and npm install locally:

```
cd frontend && npm install && npm run dev
```

Frontend is served at http://localhost:5173/

### How about the app

You can sign up a user account first, and then login using that user account.
There's no data but you can create new patients by going to Patients link in the side navigation bar, and then click the Create A Patient button to create a new patient.

In the patient form, you can add custom sections and custom fields under each custom section.

You can also edit existing patients.

### TO-DO

1. Styling -- need to make it look pretty
2. Server-side pagination, sorting and filtering once dataset gets large
3. Clean up the backend by break up some repositories and controllers
4. There's a weird bug where a newly added field doesn't persist the data nor display the field name
5. Break up the CustomSection FE components into two smaller components
