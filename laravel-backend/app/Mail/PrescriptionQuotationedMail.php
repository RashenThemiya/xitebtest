<?php

namespace App\Mail;

use App\Models\Prescription;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PrescriptionQuotationedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Prescription $prescription) {}

    public function build()
    {
        return $this->subject('Prescription Quotation Ready')
                    ->view('emails.quotationed')
                    ->with([
                        'prescription' => $this->prescription,
                        'user' => $this->prescription->user,
                    ]);
    }
}
