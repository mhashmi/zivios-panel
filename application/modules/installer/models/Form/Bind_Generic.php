<?php
/**
 * Copyright (c) 2008 Zivios, LLC.
 *
 * This file is part of Zivios.
 *
 * Zivios is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Zivios is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Zivios.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @package		ZiviosInstaller
 * @copyright	Copyright (c) 2008 Zivios, LLC. (http://www.zivios.org)
 * @license		http://www.zivios.org/legal/license
 **/
class Form_Bind_Generic extends Zend_Dojo_Form
{
    public function init()
    {
        /**
         * Certain form data needs to be prefed from existing local
         * system information as stored in the install session.
         */
        $session = Zend_Registry::get("installSession");

        $this->setName('bindsetup')
             ->setElementsBelongTo('bind-setup')
             ->setMethod('post')
             ->setAction('#');

        $this->addElement(
            'hidden',
            'skipbindsetup',
            array('value' => '1')
        );


        $this->addElement('submitButton', 'submit', array(
            'required'    => false,
            'ignore'      => true,
            'label'       => 'Skip Bind Setup',
            'onclick'     => "installer.postForm('bindsetup','/index/setupbind','pcontent','callRemoteRender'); return false;",
            
        ));

        $this->setDecorators(array(
            'FormElements',
            array('HtmlTag', array('tag' => 'dl')),
            'Form',
        ));
    }
}

