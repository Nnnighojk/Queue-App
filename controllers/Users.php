<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Users extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function __construct(){
		parent::__construct();
		header('Access-Control-Allow-Origin: *'); 
		$this->load->model('Users_model');
		$this->load->model('Admin_model');
		$this->load->model('Categories_model');
		$this->load->model('Queue_model');
		$this->load->model('Handler_model');
		$this->load->model('State_model');
		$this->load->model('City_model');		
	}	
	
	public function index()
	{
		echo "hello";
	}
	
	public function login(){
		
		//declare array to get username and password
		$value = array();
		$condition = array();
		$value["user_full_name"] = $this->input->get_post("user_full_name");
		$value["user_city"] = $this->input->get_post("user_city");
		$condition["user_mobile_no"] = $value["user_mobile_no"] = $this->input->get_post("user_mobile_no");
		$value["user_email_id"] = $this->input->get_post("user_email_id");
		$value["device_id"] = $this->input->get_post("device_id");
		$value["created_date"] = $this->input->get_post("created_date");
		$value["activate_status"] = 0;
		$value["user_token"] = $this->optCodeGenerate();
		
		$data = array();
		
		if($dataValues = $this->Users_model->getWhere($condition)){			
			$this->Users_model->update($value, $condition);
			$data["status"] = 200;
			$data["message"] = "Please enter OTP";
			$data["data"] = $value;
		}else{
			if($insertId = $this->Users_model->insert($value)){
				$data["status"] = 200;
				$data["message"] = "Please enter OTP";
				//$value["insertId"] = $insertId;
				$data["data"] = $value;				
			}else{
				$data["status"] = 100;
				$data["message"] = "Something went wrong, Try again.";
								
			}		
		}
		
		echo json_encode($data);
	}
	
	public function optCodeGenerate(){
		$otp = rand(100000,1000000);
		return $otp;
	}
	
	public function verify(){
		$data = array();
		$value = array();
		$condition = array();
		$value["activate_status"] = 1;
		$condition["user_mobile_no"] = $this->input->get_post("user_mobile_no");
		
		$this->Users_model->update($value, $condition);
		$data["status"] = 200;
		$data["message"] = "Registered Successfully";
		echo json_encode($data);
	}
	
	public function getQueueList(){
		$like = array();
		$data = array();
		$like["queue_name"] = $this->input->get_post("queue_name");
		if($value = $this->Queue_model->like($like)){
			$data["status"] = 200;
			$data["message"] = "Search result";
			$data["data"] = $value;
		}else{
			$data["status"] = 100;
			$data["message"] = "No result found.";			
		}	
		echo json_encode($data);		
	}
	
	public function getDateWiseDetails(){
		$obj = explode("T", $this->input->get_post("queue_name"));
		print_r($obj);
	}
}
