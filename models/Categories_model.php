<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Categories_model extends CI_Model {

	public function __construct() {
		parent::__construct();
		$this-> load-> library('session');
		$this->load->database();
	}

    function getdata() {
		$query = $this->db->get('queue_category');
		
		if(sizeof($query->result()) > 0){
			return $query->result_array();
		}else{
			return false;
		}
		
    }

}

?>