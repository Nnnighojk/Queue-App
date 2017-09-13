<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Handler_model extends CI_Model {

	public function __construct() {
		parent::__construct();
		$this -> load -> library('session');
		$this->load->database();
	}

    function getWheredata($condition) {
		$query = $this->db->get_where('handler', $condition);
		if(sizeof($query->result()) > 0){
			return $query->result_array();
		}else{
			return false;
		}
    }

	function insert($data){
		$this->db->insert('handler', $data);
		return true;
	}	

}

?>